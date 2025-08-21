"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface LogoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  portalType?: string;
}

export default function LogoutConfirmation({ isOpen, onClose, portalType }: LogoutConfirmationProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Clear all authentication data
      apiClient.logout();
      
      // Clear additional localStorage items
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isAuth');
        localStorage.removeItem('userPortal');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('organizationId');
        localStorage.removeItem('businessType');
        localStorage.removeItem('businessCategory');
      }
      
      toast.success('Logged out successfully');
      
      // Redirect to main page
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
    } finally {
      setIsLoggingOut(false);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl">Ready to Log Out?</CardTitle>
          <CardDescription>
            Are you sure you want to log out of the {portalType || 'portal'}? You'll need to sign in again to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Any unsaved changes will be lost
            </span>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging Out...' : 'Yes, Log Out'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
