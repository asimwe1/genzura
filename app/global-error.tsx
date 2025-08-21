"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, RefreshCw, Home, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-6">
                <AlertTriangle className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Something Went Wrong</h1>
              <h2 className="text-2xl font-semibold text-red-600 mb-3">Unexpected Error</h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                We're sorry, but something unexpected happened. Our team has been notified and is working to fix it.
              </p>
            </div>

            {/* Main Content */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Don't Worry!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    This is usually a temporary issue. Here are some things you can try:
                  </p>
                </div>

                {/* Error Details */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Error Details:</h4>
                  <p className="text-xs text-red-700 font-mono break-all">
                    {error.message || 'Unknown error occurred'}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-red-600 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Button
                    onClick={reset}
                    className="h-12 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                  
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="h-12 w-full flex items-center justify-center gap-2 hover:bg-gray-50"
                    >
                      <Home className="h-4 w-4" />
                      Go Home
                    </Button>
                  </Link>
                  
                  <Link href="/contact">
                    <Button
                      variant="outline"
                      className="h-12 w-full flex items-center justify-center gap-2 hover:bg-gray-50"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Report Issue
                    </Button>
                  </Link>
                </div>

                {/* Quick Links */}
                <div className="border-t pt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-4 text-center">
                    Quick Navigation
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
                    <Link href="/help">
                      <Button variant="ghost" size="sm" className="w-full text-blue-600 hover:bg-blue-50">
                        Help
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-500 mb-2">
                If this problem persists, please contact our support team
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
                <Link href="/status" className="text-blue-600 hover:underline">
                  System Status
                </Link>
              </div>
            </div>

            {/* Brand */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                <Package className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Genzura</span>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
