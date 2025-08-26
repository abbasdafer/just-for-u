"use client";

import { useEffect, useState } from 'react';
import { account, databases } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import type { Models } from 'appwrite';
import { useToast } from './use-toast';

export function useAuth(required = true) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [isSubscriptionActive, setSubscriptionActive] = useState(true);
  const [gymOwner, setGymOwner] = useState<any>(null);

  useEffect(() => {
    const checkAuthAndSubscription = async (currentUser: Models.User<Models.Preferences>) => {
      try {
        const ownerDoc = await databases.getDocument(
          '68ac3e83001e70c6e142',
          '68ac40e500132eb908b4',
          currentUser.$id
        );

        if (ownerDoc) {
          setGymOwner(ownerDoc);
          const endDate = ownerDoc.subscriptionEndDate ? new Date(ownerDoc.subscriptionEndDate) : null;
          if (endDate && new Date() > endDate) {
            setSubscriptionActive(false);
            toast({
              variant: 'destructive',
              title: 'انتهى الاشتراك',
              description: 'يرجى تجديد اشتراكك للاستمرار.',
            });
            await account.deleteSession('current');
            router.push('/');
          } else {
            setSubscriptionActive(true);
          }
        } else if (required) {
          console.warn("User exists in auth, but no gymOwner document found.");
        }
      } catch (e: any) {
        console.error("Error checking subscription:", e);
        setError(e);
        setSubscriptionActive(true);
      }
    };

    const fetchUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        await checkAuthAndSubscription(currentUser);
      } catch (e) {
        if (required) {
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [required, router, toast]);

  return { user, gymOwner, loading, error, isSubscriptionActive };
}