"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/AuthGuard';
import { Toaster } from '@/components/ui/sonner';
import OrganizationManager from '@/components/OrganizationManager';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

export default function PlatformPage() {
  const router = useRouter();
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is platform admin
    const checkPlatformAdmin = () => {
      const userRole = localStorage.getItem('userRole');
      const isAuth = localStorage.getItem('isAuth') === 'true';
      
      if (!isAuth) {
        router.replace('/login');
        return;
      }

      if (userRole !== 'platform_admin') {
        toast.error('Access denied. Platform admin privileges required.');
        router.replace('/product');
        return;
      }

      setIsPlatformAdmin(true);
      setIsLoading(false);
    };

    checkPlatformAdmin();
  }, [router]);

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <Toaster />
      </AuthGuard>
    );
  }

  if (!isPlatformAdmin) {
    return null;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <OrganizationManager />
        </div>
      </div>
      <Toaster />
    </AuthGuard>
  );
}
