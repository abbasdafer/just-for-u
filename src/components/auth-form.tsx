"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Phone, Lock } from "lucide-react";
import { ID, Query } from "appwrite";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { account, databases } from "@/lib/appwrite";
import type { PromoCode } from "./promo-code-manager";
import { Separator } from "./ui/separator";

// Schemas
const loginSchema = z.object({
  identifier: z.string().min(1, { message: "الرجاء إدخال بريد إلكتروني أو رقم هاتف." }),
  password: z.string().min(1, { message: "كلمة المرور مطلوبة." }),
});

const signupSchema = z.object({
  identifier: z.string().min(1, { message: "الرجاء إدخال بريد إلكتروني أو رقم هاتف." }),
  password: z.string().min(8, { message: "يجب أن لا تقل كلمة المرور عن 8 أحرف." }),
  promoCode: z.string().min(1, { message: "رمز اشتراك صالح مطلوب." }),
  pricing: z.object({
    dailyFitness: z.coerce.number().min(0, "يجب أن يكون السعر موجبًا."),
    weeklyFitness: z.coerce.number().min(0, "يجب أن يكون السعر موجبًا."),
    monthlyFitness: z.coerce.number().min(0, "يجب أن يكون السعر موجبًا."),
    dailyIron: z.coerce.number().min(0, "يجب أن يكون السعر موجبًا."),
    weeklyIron: z.coerce.number().min(0, "يجب أن يكون السعر موجبًا."),
    monthlyIron: z.coerce.number().min(0, "يجب أن يكون السعر موجبًا."),
  })
});

const otpSchema = z.object({
  otp: z.string().min(6, { message: "الرجاء إدخال رمز التحقق المكون من 6 أرقام." }),
});

// Helper Functions
const isEmail = (text: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
const isPhoneNumber = (text: string) => /^\+?[1-9]\d{1,14}$/.test(text);

// Component
export function AuthForm({ initialTab = 'login' }: { initialTab?: 'login' | 'signup' }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [showOtp, setShowOtp] = React.useState(false);
  const [pendingSignupData, setPendingSignupData] = React.useState<z.infer<typeof signupSchema> | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);

  // Forms
  const loginForm = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema), defaultValues: { identifier: "", password: "" }});
  const signupForm = useForm<z.infer<typeof signupSchema>>({ resolver: zodResolver(signupSchema), defaultValues: { identifier: "", password: "", promoCode: "", pricing: { dailyFitness: 0, weeklyFitness: 0, monthlyFitness: 0, dailyIron: 0, weeklyIron: 0, monthlyIron: 0 }}});
  const otpForm = useForm<z.infer<typeof otpSchema>>({ resolver: zodResolver(otpSchema), defaultValues: { otp: "" }});

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    const { identifier, password } = values;

    try {
        if (isEmail(identifier)) {
            await account.createEmailPasswordSession(identifier, password);
        } else if (isPhoneNumber(identifier)) {
            // Appwrite doesn't support direct password login with phone number
            // You need to send an OTP first
            toast({ variant: "destructive", title: "فشل الدخول", description: "تسجيل الدخول برقم الهاتف يتطلب التحقق عبر رمز. يرجى التسجيل أولاً." });
            setLoading(false);
            return;
        } else {
            toast({ variant: "destructive", title: "إدخال غير صالح", description: "الرجاء إدخال بريد إلكتروني أو رقم هاتف صحيح." });
            setLoading(false);
            return;
        }
        toast({ title: "تم تسجيل الدخول بنجاح" });
        router.push("/dashboard");
    } catch (error) {
        toast({ variant: "destructive", title: "فشل الدخول", description: "البيانات التي أدخلتها غير صحيحة." });
    }
    setLoading(false);
  };
  
  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.success) {
        toast({ title: "تم التسجيل بنجاح!", description: "تم إعداد حسابك وجاري التوجيه..." });
        router.push("/dashboard");
      } else {
        toast({ variant: "destructive", title: "خطأ في التسجيل", description: result.message });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "خطأ في التسجيل", description: "حدث خطأ ما. يرجى المحاولة مرة أخرى." });
    }
    setLoading(false);
  }

  const handleOtpSubmit = async (values: z.infer<typeof otpSchema>) => {
    if (!userId || !pendingSignupData) return;
    setLoading(true);
    try {
      await account.updatePhoneSession(userId, values.otp);
      // After successful phone verification, you might want to call another API endpoint
      // to complete the profile creation, or handle it directly here if it's simple.
      // For now, we'll just show a success message and redirect.
      toast({ title: "تم التحقق بنجاح!", description: "جاري التوجيه..." });
      router.push("/dashboard");
    } catch (error) {
      toast({ variant: "destructive", title: "فشل التحقق", description: "رمز التحقق الذي أدخلته غير صحيح." });
      setShowOtp(false); // Hide OTP form on failure to allow retry
      setPendingSignupData(null);
    }
    setLoading(false);
  };
  
  if (showOtp && pendingSignupData) {
    return (
       <Form {...otpForm}>
        <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4 p-4">
            <h3 className="font-semibold text-lg text-center">التحقق من رقم الهاتف</h3>
            <p className="text-sm text-muted-foreground text-center">أدخل الرمز المكون من 6 أرقام الذي أرسلناه إلى {pendingSignupData.identifier}</p>
            <FormField control={otpForm.control} name="otp" render={({ field }) => (
              <FormItem>
                <FormLabel>رمز التحقق (OTP)</FormLabel>
                <FormControl><Input placeholder="123456" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" className="w-full" onClick={() => setShowOtp(false)}>إلغاء</Button>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                  تحقق ومتابعة
                </Button>
            </div>
        </form>
      </Form>
    )
  }

  return (
    <>
    <Tabs defaultValue={initialTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
        <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4 p-4">
             <FormField control={loginForm.control} name="identifier" render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني أو رقم الهاتف</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Mail className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g., mail@example.com or +966..." {...field} className="pr-8" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
               <FormField control={loginForm.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                     <div className="relative">
                        <Lock className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="••••••••" {...field} className="pr-8" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full !mt-6" disabled={loading}>
                {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                تسجيل الدخول
              </Button>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="signup">
         <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4 p-4 max-h-[70vh] overflow-y-auto">
                 <FormField control={signupForm.control} name="identifier" render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني أو رقم الهاتف</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <Mail className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="سيكون وسيلة الدخول لحسابك" {...field} className="pr-8"/>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={signupForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <Lock className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="password" placeholder="٨ أحرف على الأقل" {...field} className="pr-8" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signupForm.control} name="promoCode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>رمز الاشتراك</FormLabel>
                      <FormControl><Input placeholder="أدخل الرمز الذي حصلت عليه" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-center">أسعار الاشتراكات المبدئية</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-4 p-4 border rounded-lg">
                        <h4 className="font-medium text-center text-primary">أسعار اللياقة</h4>
                        <FormField control={signupForm.control} name="pricing.dailyFitness" render={({ field }) => (<FormItem><FormLabel>يومي</FormLabel><FormControl><div className="relative"><span className="absolute right-2.5 top-2.5 text-sm text-muted-foreground">د.ع</span><Input type="number" placeholder="0" className="pr-8" {...field} /></div></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={signupForm.control} name="pricing.weeklyFitness" render={({ field }) => (<FormItem><FormLabel>أسبوعي</FormLabel><FormControl><div className="relative"><span className="absolute right-2.5 top-2.5 text-sm text-muted-foreground">د.ع</span><Input type="number" placeholder="0" className="pr-8" {...field} /></div></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={signupForm.control} name="pricing.monthlyFitness" render={({ field }) => (<FormItem><FormLabel>شهري</FormLabel><FormControl><div className="relative"><span className="absolute right-2.5 top-2.5 text-sm text-muted-foreground">د.ع</span><Input type="number" placeholder="0" className="pr-8" {...field} /></div></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <div className="space-y-4 p-4 border rounded-lg">
                        <h4 className="font-medium text-center text-primary">أسعار الحديد</h4>
                        <FormField control={signupForm.control} name="pricing.dailyIron" render={({ field }) => (<FormItem><FormLabel>يومي</FormLabel><FormControl><div className="relative"><span className="absolute right-2.5 top-2.5 text-sm text-muted-foreground">د.ع</span><Input type="number" placeholder="0" className="pr-8" {...field} /></div></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={signupForm.control} name="pricing.weeklyIron" render={({ field }) => (<FormItem><FormLabel>أسبوعي</FormLabel><FormControl><div className="relative"><span className="absolute right-2.5 top-2.5 text-sm text-muted-foreground">د.ع</span><Input type="number" placeholder="0" className="pr-8" {...field} /></div></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={signupForm.control} name="pricing.monthlyIron" render={({ field }) => (<FormItem><FormLabel>شهري</FormLabel><FormControl><div className="relative"><span className="absolute right-2.5 top-2.5 text-sm text-muted-foreground">د.ع</span><Input type="number" placeholder="0" className="pr-8" {...field} /></div></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    </div>
                  </div>

                <Button type="submit" className="w-full !mt-6" disabled={loading}>
                    {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    إنشاء حساب جديد
                </Button>
            </form>
         </Form>
      </TabsContent>
    </Tabs>
    </>
  );
}