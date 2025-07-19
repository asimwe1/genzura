"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Package, Settings, Coffee, Car, ShoppingCart, Building2 } from "lucide-react";

export default function SignupPage() {
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessType, setBusinessType] = useState("product");
  const [businessCategory, setBusinessCategory] = useState("coffee");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("isAuth", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("organizationName", organizationName);
      localStorage.setItem("businessType", businessType);
      localStorage.setItem("businessCategory", businessCategory);
      setIsLoading(false);
      alert("Account created successfully!");
      window.location.href = businessType === "service" ? "/service" : "/product";
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <Card className="w-full max-w-lg p-12 shadow-2xl">
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
          <form className="space-y-8" onSubmit={handleSignup}>
            <div className="space-y-4">
              <Label htmlFor="organizationName" className="text-base">Organization Name *</Label>
              <Input
                id="organizationName"
                type="text"
                placeholder="Enter your organization name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                required
                className="w-full py-4 text-base bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 transition-colors"
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full py-4 text-base bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 transition-colors"
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="password" className="text-base">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full py-4 text-base bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 transition-colors"
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="confirmPassword" className="text-base">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full py-4 text-base bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 transition-colors"
              />
            </div>
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
                  {businessType === "product"
                    ? [
                        { value: "coffee", label: "Coffee Management", icon: Coffee },
                        { value: "retail", label: "Retail Store", icon: ShoppingCart },
                        { value: "manufacturing", label: "Manufacturing", icon: Building2 },
                        { value: "agriculture", label: "Agriculture", icon: Coffee },
                      ].map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center space-x-2">
                            <category.icon className="h-4 w-4" />
                            <span>{category.label}</span>
                          </div>
                        </SelectItem>
                      ))
                    : [
                        { value: "garage", label: "Auto Garage", icon: Car },
                        { value: "consulting", label: "Consulting", icon: Settings },
                        { value: "healthcare", label: "Healthcare", icon: Settings },
                        { value: "education", label: "Education", icon: Settings },
                      ].map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center space-x-2">
                            <category.icon className="h-4 w-4" />
                            <span>{category.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full mt-6 py-5 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors rounded-lg shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
            <div className="mt-16 text-center">
              <p className="text-base text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 