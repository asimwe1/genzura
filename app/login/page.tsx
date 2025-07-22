"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, Mail, Lock } from "lucide-react";
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [portalType, setPortalType] = useState("product");
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-lg p-12 bg-white rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center justify-center gap-4 mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl mb-2">
            <Package className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Sign in to Genzura</h1>
          <p className="text-gray-600 text-lg text-center">Inventory Management System</p>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!email || !password) {
            alert("Please fill in all fields");
            return;
          }
          setIsLoading(true);
          localStorage.setItem("isAuth", "true");
          localStorage.setItem("userPortal", portalType);
          setIsLoading(false);
          window.location.href = portalType === "service" ? "/service" : "/product";
        }} className="space-y-8">
          <div className="space-y-4">
            <label className="block text-base font-medium mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="email"
                placeholder="you@email.com"
                className="pl-12 py-4 text-base bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-base font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="password"
                placeholder="••••••••"
                className="pl-12 py-4 text-base bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
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
          </div>
          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full mt-6 py-5 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors rounded-lg shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div className="mt-16 text-center">
          <p className="text-base text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 