import { NextResponse } from "next/server";
import { ID, Query } from "appwrite";
import { account, databases } from "@/lib/appwrite";
import type { PromoCode } from "@/components/promo-code-manager";

export async function POST(request: Request) {
  try {
    const { identifier, password, promoCode, pricing } = await request.json();

    // 1. Create user account
    const newUser = await account.create(ID.unique(), identifier, password);
    const userId = newUser.$id;

    // 2. Create user session (log them in)
    await account.createEmailPasswordSession(identifier, password);

    // 3. Validate and use promo code
    const promoCodes = await databases.listDocuments(
      '68ac3e83001e70c6e142', // Replace with your database ID
      '68ac41470012db625149', // Replace with your promo codes collection ID
      [
        Query.equal("code", promoCode.trim())
      ]
    );

    if (promoCodes.documents.length === 0) {
      return NextResponse.json({ success: false, message: "رمز التفعيل غير صالح أو منتهي الصلاحية." }, { status: 400 });
    }

    const promoDoc = promoCodes.documents[0];
    const promoData = promoDoc as unknown as Omit<PromoCode, 'id'>;

    if (promoData.status !== 'active' || promoData.uses >= promoData.maxUses) {
      return NextResponse.json({ success: false, message: "هذا الرمز تم استخدامه بالكامل أو غير نشط." }, { status: 400 });
    }

    const newUses = promoData.uses + 1;
    await databases.updateDocument(
      '68ac3e83001e70c6e142', // Replace with your database ID
      '68ac41470012db625149', // Replace with your promo codes collection ID
      promoDoc.$id,
      { uses: newUses }
    );

    // 4. Create user profile in database
    const startDate = new Date();
    const endDate = new Date();
    if (promoData.type === 'monthly') endDate.setMonth(startDate.getMonth() + 1);
    else endDate.setFullYear(startDate.getFullYear() + 1);

    const userData = {
      email: identifier,
      uid: userId,
      subscriptionType: promoData.type,
      subscriptionStartDate: startDate.toISOString(),
      subscriptionEndDate: endDate.toISOString(),
      pricing: JSON.stringify(pricing),
      createdAt: new Date().toISOString(),
    };

    await databases.createDocument(
      '68ac3e83001e70c6e142', // Replace with your database ID
      '68ac40e500132eb908b4', // Replace with your gym owners collection ID
      userId,
      userData
    );

    return NextResponse.json({ success: true, message: "User created successfully" });
  } catch (error: any) {
    console.error("API Signup Error:", error);
    // Handle specific Appwrite errors if needed
    if (error.code === 409) { // User already exists
      return NextResponse.json({ success: false, message: "هذا المستخدم موجود بالفعل." }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: error.message || "حدث خطأ ما. يرجى المحاولة مرة أخرى." }, { status: 500 });
  }
}
