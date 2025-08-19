"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, Mail, Lock, AlertCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AuthForm from "@/components/ui/AuthForm";
import { useLogin, usePlatformLogin } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [portalType, setPortalType] = useState("product");
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);
  const router = useRouter();

  // API hooks
  const loginHook = useLogin();
  const platformLoginHook = useLogin();

  // Handle login based on portal type
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      let response;
      
      if (isPlatformAdmin) {
        response = await platformLoginHook.execute({ email, password });
      } else {
        response = await loginHook.execute({ email, password });
      }

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
        toast.error(response?.error || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred during login");
      console.error("Login error:", error);
    }
  };

  // Check if user is platform admin based on email
  useEffect(() => {
    setIsPlatformAdmin(email === "admin@genzura.com");
  }, [email]);

  // Show loading state
  const isLoading = loginHook.loading || platformLoginHook.loading;

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
              type: "password",
              placeholder: "••••••••",
              required: true,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              icon: <Lock className="h-5 w-5" />,
            },
          ]}
        >
          <div className="space-y-4">
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
        </div>
      </div>
    </div>
  );
} 