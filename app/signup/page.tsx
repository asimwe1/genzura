"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import AuthForm from "@/components/ui/AuthForm";
import { Package, Settings, Box, Car, ShoppingCart, Building2, MoreHorizontal, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useSignup } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignupPage() {
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessType, setBusinessType] = useState("product");
  const [businessCategory, setBusinessCategory] = useState("inventory");
  const [customCategory, setCustomCategory] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [signupStatus, setSignupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [signupMessage, setSignupMessage] = useState<string>('');
  
  const router = useRouter();
  const signupHook = useSignup();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous status
    setSignupStatus('loading');
    setSignupMessage('');
    
    // Validation
    if (password !== confirmPassword) {
      setSignupStatus('error');
      setSignupMessage('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setSignupStatus('error');
      setSignupMessage('Password must be at least 6 characters');
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (businessCategory === "other" && !customCategory.trim()) {
      setSignupStatus('error');
      setSignupMessage('Please specify your service or product');
      toast.error('Please specify your service or product');
      return;
    }

    try {
      const finalCategory = businessCategory === "other" ? customCategory : businessCategory;
      
      const response = await signupHook.execute({
        organizationName,
        email,
        password,
        businessType,
        businessCategory: finalCategory,
      });

      if (response?.status === 'success' && response.data?.token) {
        // Store authentication data
        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("userRole", response.data.user?.role || "SuperAdmin");
          localStorage.setItem("businessType", businessType);
          localStorage.setItem("businessCategory", finalCategory);
          localStorage.setItem("organizationName", organizationName);
          localStorage.setItem("isAuth", "true"); // This is what AuthGuard checks for!
          if (response.data.user?.organization_id) {
            localStorage.setItem("organizationId", response.data.user.organization_id.toString());
          }
        }

        setSignupStatus('success');
        setSignupMessage('Account created successfully! Redirecting to your portal...');
        toast.success('Account created successfully!');
        setShowSuccess(true);
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push(businessType === "service" ? "/service" : "/product");
        }, 2000);
      } else {
        const errorMsg = response?.error || 'Signup failed. Please try again.';
        setSignupStatus('error');
        setSignupMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      setSignupStatus('error');
      setSignupMessage(errorMsg);
      toast.error('Signup failed. Please try again.');
    }
  };
  const productCategories = [
    { value: "inventory", label: "Inventory Management", icon: Box },
    { value: "retail", label: "Retail Store", icon: ShoppingCart },
    { value: "manufacturing", label: "Manufacturing", icon: Building2 },
    { value: "agriculture", label: "Agriculture", icon: Box },
    { value: "other", label: "Other", icon: MoreHorizontal },
  ];
  const serviceCategories = [
    { value: "garage", label: "Auto Garage", icon: Car },
    { value: "consulting", label: "Consulting", icon: Settings },
    { value: "healthcare", label: "Healthcare", icon: Settings },
    { value: "education", label: "Education", icon: Settings },
    { value: "other", label: "Other", icon: MoreHorizontal },
  ];
  const categories = businessType === "product" ? productCategories : serviceCategories;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-lg p-12 shadow-2xl">
        <CardHeader className="space-y-6 pb-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl mb-2">
              <Package className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-4xl font-bold text-center text-gray-800 mb-6">Create Account</CardTitle>
          </div>
          <CardDescription className="text-center text-lg text-gray-600 leading-relaxed mt-4">
            Welcome to the business management system! Sign up to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-10 px-6">
                  <AuthForm
          mode="signup"
          onSubmit={handleSignup}
          loading={signupStatus === 'loading'}
          error={signupStatus === 'error' ? signupMessage : undefined}
          success={signupStatus === 'success' ? signupMessage : undefined}
          fields={[
              {
                name: "organizationName",
                label: "Organization Name *",
                type: "text",
                placeholder: "Enter your organization name",
                required: true,
                value: organizationName,
                onChange: (e) => setOrganizationName(e.target.value),
              },
              {
                name: "email",
                label: "Email",
                type: "email",
                placeholder: "Enter your email",
                required: true,
                value: email,
                onChange: (e) => setEmail(e.target.value),
              },
              {
                name: "password",
                label: "Password",
                type: "password",
                placeholder: "Enter your password",
                required: true,
                value: password,
                onChange: (e) => setPassword(e.target.value),
              },
              {
                name: "confirmPassword",
                label: "Confirm Password",
                type: "password",
                placeholder: "Confirm your password",
                required: true,
                value: confirmPassword,
                onChange: (e) => setConfirmPassword(e.target.value),
              },
            ]}
          >
            <div className="space-y-4">
              <Label className="text-base font-medium">Select Business Type *</Label>
              <RadioGroup
                value={businessType}
                onValueChange={setBusinessType}
                className="grid grid-cols-2 gap-6"
              >
                <div>
                  <RadioGroupItem
                    value="product"
                    id="product"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="product"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-6 transition-all duration-200 hover:bg-blue-50 hover:shadow-lg hover:border-blue-400 hover:text-blue-700 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Package className="mb-3 h-7 w-7 transition-colors duration-200 group-hover:text-blue-600" />
                    <div className="space-y-1 text-center">
                      <p className="text-base font-medium leading-none">Product-Based</p>
                      <p className="text-xs text-muted-foreground">
                        Manage inventory, production, and products
                      </p>
                    </div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="service"
                    id="service"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="service"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-6 transition-all duration-200 hover:bg-blue-50 hover:shadow-lg hover:border-blue-400 hover:text-blue-700 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Settings className="mb-3 h-7 w-7 transition-colors duration-200 group-hover:text-blue-600" />
                    <div className="space-y-1 text-center">
                      <p className="text-base font-medium leading-none">Service-Based</p>
                      <p className="text-xs text-muted-foreground">
                        Manage services, clients, and operations
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-4">
              <Label className="text-base font-medium">Select Business Category *</Label>
              <Select value={businessCategory} onValueChange={setBusinessCategory}>
                <SelectTrigger className="w-full bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 transition-colors">
                  <SelectValue placeholder="Select business category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center space-x-2">
                        {typeof category.icon === 'function' ? (
                          <category.icon className="h-4 w-4" />
                        ) : (
                          <span className="h-4 w-4 inline-block" />
                        )}
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {businessCategory === "other" && (
                <div className="pt-2">
                  <Label htmlFor="customCategory" className="text-base">Specify your service or product *</Label>
                  <Input
                    id="customCategory"
                    type="text"
                    placeholder={businessType === "service" ? "e.g. Plumbing, Legal, etc." : "e.g. Electronics, Books, etc."}
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    required
                    className="w-full py-3 text-base bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 transition-colors mt-2"
                  />
                </div>
              )}
            </div>
          </AuthForm>
          <div className="mt-16 text-center">
            <p className="text-base text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </div>
      {/* Floating Modal Prompt */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center border border-blue-100 animate-fade-in">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Account Created!</h2>
            <p className="text-gray-700 text-center mb-6">Your account has been created successfully.<br />You will be redirected to your portal.</p>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-xl shadow"
              onClick={() => {
                setShowSuccess(false);
                window.location.href = businessType === "service" ? "/service" : "/product";
              }}
            >
              Go to Portal
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 