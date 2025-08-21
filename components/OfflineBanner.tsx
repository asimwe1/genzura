"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';

interface OfflineBannerProps {
  portalType: 'Product Portal' | 'Service Portal' | 'Platform Admin';
}

export default function OfflineBanner({ portalType }: OfflineBannerProps) {
  const [isOffline, setIsOffline] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await apiClient.healthCheck();
        setIsOffline(response.status !== 'success');
        setLastCheck(new Date());
      } catch (error) {
        setIsOffline(true);
        setLastCheck(new Date());
      }
    };

    // Check on mount
    checkConnection();

    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRetry = async () => {
    setIsChecking(true);
    setRetryCount(prev => prev + 1);

    try {
      const response = await apiClient.forceCheckOnline();
      if (response) {
        setIsOffline(false);
        toast.success('Backend connection restored!');
      } else {
        setIsOffline(true);
        toast.error('Still unable to connect to backend');
      }
    } catch (error) {
      setIsOffline(true);
      toast.error('Connection check failed');
    } finally {
      setIsChecking(false);
    }
  };

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WifiOff className="h-5 w-5" />
            <div>
              <p className="font-medium">
                {portalType} is currently offline
              </p>
              <p className="text-sm text-red-100">
                Last check: {lastCheck.toLocaleTimeString()} • Retry attempts: {retryCount}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={isChecking}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Wifi className="h-4 w-4 mr-2" />
                  Retry Connection
                </>
              )}
            </Button>
            
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse"></div>
              <span>Backend Unreachable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
