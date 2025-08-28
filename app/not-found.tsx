"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const goHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-6">
            <Package className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-700 mb-3">Page Not Found</h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Oops! The page you're looking for seems to have wandered off into the digital wilderness.
          </p>
        </div>

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Don't Panic!
              </h3>
              <p className="text-gray-600">
                While we search for your missing page, here are some helpful options:
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Button
                onClick={goBack}
                variant="outline"
                className="h-12 flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              
              <Button
                onClick={goHome}
                className="h-12 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
              
              <Link href="/search">
                <Button
                  variant="outline"
                  className="h-12 w-full flex items-center justify-center gap-2 hover:bg-gray-50"
                >
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4 text-center">
                Popular Pages
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="w-full text-blue-600 hover:bg-blue-50">
                    Login
                  </Button>
                </Link>
                <Link href="/product">
                  <Button variant="ghost" size="sm" className="w-full text-blue-600 hover:bg-blue-50">
                    Product Portal
                  </Button>
                </Link>
                <Link href="/service">
                  <Button variant="ghost" size="sm" className="w-full text-blue-600 hover:bg-blue-50">
                    Service Portal
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button variant="ghost" size="sm" className="w-full text-blue-600 hover:bg-blue-50">
                    Documentation
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 mb-2">
            Still can't find what you're looking for?
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact Support
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/help" className="text-blue-600 hover:underline">
              Help Center
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/feedback" className="text-blue-600 hover:underline">
              Report Issue
            </Link>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
            <p className="text-sm text-gray-600">
              💡 <strong>Fun Fact:</strong> 404 errors were named after room 404 at CERN where the web was invented!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
