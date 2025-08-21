"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AuthForm from "@/components/ui/AuthForm";
import { useLogin, usePlatformLogin } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [portalType, setPortalType] = useState("product");
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const router = useRouter();

  // API hooks
  const loginHook = useLogin();
  const platformLoginHook = usePlatformLogin();
  
  // Network status
  const [networkStatus, setNetworkStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Handle login based on portal type
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    loginHook.reset();
    platformLoginHook.reset();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate credentials before sending to backend
    const validation = apiClient.validateCredentials(email, password);
    if (!validation.isValid) {
      toast.error(validation.error || "Invalid credentials");
      return;
    }

    try {
      let response;
      
      if (isPlatformAdmin) {
        console.log("Attempting platform admin login...");
        response = await platformLoginHook.execute({ email, password });
      } else {
        console.log("Attempting organization user login...");
        response = await loginHook.execute({ email, password });
      }

      console.log("Login response:", response);

      if (response?.status === 'success' && response.data?.token) {
        // Store authentication data
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("userPortal", portalType);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", response.data.user.role);
        
        if (response.data.user.organization_id) {
          localStorage.setItem("organizationId", response.data.user.organization_id.toString());
        }

        toast.success("Login successful!");
        
        // Redirect based on portal type
        const redirectPath = portalType === "service" ? "/service" : "/product";
        router.push(redirectPath);
      } else {
        const errorMessage = response?.error || "Login failed. Please check your credentials.";
        toast.error(errorMessage);
        console.error("Login failed:", response);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    }
  };

  // Check if user is platform admin based on email
  useEffect(() => {
    setIsPlatformAdmin(email === "admin@genzura.com");
  }, [email]);

  // Show loading state
  const isLoading = loginHook.loading || platformLoginHook.loading;

  // Check network status on mount
  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        const response = await fetch('https://genzura.aphezis.com/health', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        setNetworkStatus(response.ok ? 'online' : 'offline');
      } catch (error) {
        setNetworkStatus('offline');
      }
    };
    
    checkNetworkStatus();
  }, []);

  // Toggle debug mode (hold Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setDebugMode(prev => !prev);
        toast.info(`Debug mode ${!debugMode ? 'enabled' : 'disabled'}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [debugMode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-lg p-12 bg-white rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center justify-center gap-4 mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl mb-2">
            <Package className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Sign in to Genzura</h1>
          <p className="text-gray-600 text-lg text-center">Inventory Management System</p>
          
          {/* Platform Admin Indicator */}
          {isPlatformAdmin && (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800 font-medium">Platform Administrator</span>
            </div>
          )}

          {/* Network Status Indicator */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            networkStatus === 'online' 
              ? 'bg-green-50 border border-green-200' 
              : networkStatus === 'offline'
              ? 'bg-red-50 border border-red-200'
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              networkStatus === 'online' ? 'bg-green-500' : networkStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
            <span className={`text-sm font-medium ${
              networkStatus === 'online' ? 'text-green-800' : networkStatus === 'offline' ? 'text-red-800' : 'text-yellow-800'
            }`}>
              {networkStatus === 'online' ? 'Backend Online' : networkStatus === 'offline' ? 'Backend Offline' : 'Checking Connection...'}
            </span>
          </div>

          {/* Debug Mode Indicator */}
          {debugMode && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800 font-medium">Debug Mode Active</span>
            </div>
          )}
        </div>

        <AuthForm
          mode="login"
          onSubmit={handleLogin}
          loading={isLoading}
          fields={[
            {
              name: "email",
              label: "Email",
              type: "email",
              placeholder: "you@email.com",
              required: true,
              value: email,
              onChange: (e) => setEmail(e.target.value),
              icon: <Mail className="h-5 w-5" />,
            },
            {
              name: "password",
              label: "Password",
              type: showPassword ? "text" : "password",
              placeholder: "••••••••",
              required: true,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              icon: <Lock className="h-5 w-5" />,
            },
          ]}
        >
          <div className="space-y-4">
            {/* Password Visibility Toggle */}
            <div className="flex items-center justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="h-8 px-2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="ml-2 text-xs">
                  {showPassword ? "Hide" : "Show"} password
                </span>
              </Button>
            </div>

            <label className="block text-base font-medium mb-1">Portal</label>
            <Select value={portalType} onValueChange={setPortalType}>
              <SelectTrigger className="w-full bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Product Portal</SelectItem>
                <SelectItem value="service">Service Portal</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="text-right">
              <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>
        </AuthForm>

        {/* Error Display */}
        {(loginHook.error || platformLoginHook.error) && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              {loginHook.error || platformLoginHook.error}
            </p>
          </div>
        )}

        {/* Debug Information */}
        {debugMode && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Debug Info:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Email: {email}</p>
              <p>Password Length: {password.length}</p>
              <p>Is Platform Admin: {isPlatformAdmin.toString()}</p>
              <p>Portal Type: {portalType}</p>
              <p>Backend URL: https://genzura.aphezis.com</p>
              <p>Login Hook Loading: {loginHook.loading.toString()}</p>
              <p>Platform Login Hook Loading: {platformLoginHook.loading.toString()}</p>
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-base text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo Credentials Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Platform Admin:</strong> admin@genzura.com / admin123</p>
            <p><strong>Organization User:</strong> john.doe@democompany.com / user123</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Hold Ctrl+Shift+D to toggle debug mode
          </p>
        </div>

        {/* Backend Status Info */}
        {networkStatus === 'offline' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-sm font-medium text-red-700 mb-2">⚠️ Backend Connection Issue</h3>
            <div className="text-xs text-red-600 space-y-1">
              <p>• The backend server is currently not accessible</p>
              <p>• Please check your internet connection</p>
              <p>• If the problem persists, contact support</p>
              <p>• Visit <a href="/debug" className="underline">Debug Page</a> for more information</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 