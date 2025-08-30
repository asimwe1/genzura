"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Package,
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle,
  Loader2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [networkStatus, setNetworkStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [loginStatus, setLoginStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [loginMessage, setLoginMessage] = useState<string>("");

  // Check if user is platform admin based on email
  useEffect(() => {
    setIsPlatformAdmin(email === "admin@genzura.com");
  }, [email]);

  // Show loading state
  const isLoading =
    loginHook.loading || platformLoginHook.loading || loginStatus === "loading";

  // Check network status on mount using the improved API client
  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        const isOnline = await apiClient.forceCheckOnline();
        setNetworkStatus(isOnline ? "online" : "offline");
      } catch (error) {
        setNetworkStatus("offline");
        console.error("Network check failed:", error);
      }
    };

    checkNetworkStatus();

    // Set up periodic network checks
    const interval = setInterval(checkNetworkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Handle retry connection using the improved API client
  const handleRetryConnection = async () => {
    setNetworkStatus("checking");
    setRetryCount((prev) => prev + 1);

    try {
      const isOnline = await apiClient.forceCheckOnline();

      if (isOnline) {
        setNetworkStatus("online");
        setLastError(null);
        setLoginStatus("idle");
        setLoginMessage("");
        toast.success("Backend connection restored!");
      } else {
        setNetworkStatus("offline");
        setLastError("Backend server not accessible");
      }
    } catch (error) {
      setNetworkStatus("offline");
      setLastError("Connection timeout");
      toast.error("Still unable to connect to backend");
    }
  };

  // Handle login with better error handling
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous status
    setLoginStatus("loading");
    setLoginMessage("");
    setLastError(null);

    if (networkStatus === "offline") {
      setLoginStatus("error");
      setLoginMessage(
        "Cannot login while offline. Please check your connection and try again."
      );
      toast.error(
        "Cannot login while offline. Please check your connection and try again."
      );
      return;
    }

    if (!email || !password) {
      setLoginStatus("error");
      setLoginMessage("Please fill in all required fields");
      toast.error("Please fill in all fields");
      return;
    }

    // Clear any previous errors
    loginHook.reset();
    platformLoginHook.reset();

    try {
      let response;

      if (isPlatformAdmin) {
        response = await platformLoginHook.execute({ email, password });
      } else {
        response = await loginHook.execute({ email, password });
      }

      console.log("Login response:", response); // Debug log

      if (response?.status === "success" && response.data?.token) {
        // Store token and user info
        if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
          localStorage.setItem("userRole", response.data.user?.role || "user");
          localStorage.setItem("businessType", portalType);
          localStorage.setItem("isAuth", "true"); // This is what AuthGuard checks for!
          if (response.data.user?.organization_id) {
            localStorage.setItem(
              "organizationId",
              response.data.user.organization_id.toString()
            );
          }
        }

        setLoginStatus("success");
        const redirectPath = isPlatformAdmin ? "/product" : `/${portalType}`;
        setLoginMessage(`Welcome back! Redirecting to ${redirectPath}...`);
        toast.success(`Welcome back! Redirecting to ${redirectPath}...`);

        console.log("Redirecting to:", redirectPath); // Debug log

        // Redirect after a short delay to show success message
        setTimeout(() => {
          console.log("Executing redirect to:", redirectPath); // Debug log
          try {
            if (isPlatformAdmin) {
              router.push("/product");
            } else {
              router.push(`/${portalType}`);
            }
          } catch (error) {
            console.error("Router.push failed, trying window.location:", error);
            // Fallback to window.location if router.push fails
            window.location.href = redirectPath;
          }
        }, 1500);

        // Also add a backup redirect in case the setTimeout fails
        setTimeout(() => {
          if (window.location.pathname === "/login") {
            console.log(
              "Still on login page, forcing redirect with window.location"
            );
            window.location.href = redirectPath;
          }
        }, 3000);
      } else {
        const errorMsg =
          response?.error || "Login failed. Please check your credentials.";
        setLoginStatus("error");
        setLoginMessage(errorMsg);

        if (response?.offline) {
          setLoginMessage(
            "Backend is currently offline. Please try again later."
          );
          toast.error("Backend is currently offline. Please try again later.");
        } else {
          toast.error(errorMsg);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setLoginStatus("error");
      setLoginMessage(errorMsg);
      toast.error("Login failed. Please try again.");
    }
  };

  // Toggle debug mode (hold Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setDebugMode((prev) => !prev);
        toast.info(`Debug mode ${!debugMode ? "enabled" : "disabled"}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [debugMode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-lg p-12 bg-white rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center justify-center gap-4 mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl mb-2">
            <Package className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
            Sign in to Genzura
          </h1>
          <p className="text-gray-600 text-lg text-center">
            Inventory Management System
          </p>

          {/* Platform Admin Indicator */}
          {isPlatformAdmin && (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800 font-medium">
                Platform Administrator
              </span>
            </div>
          )}

          {/* Network Status Indicator */}
          <div
            className={`flex items-center justify-between px-3 py-2 rounded-lg ${
              networkStatus === "online"
                ? "bg-green-50 border border-green-200"
                : networkStatus === "offline"
                ? "bg-red-50 border border-red-200"
                : "bg-yellow-50 border border-yellow-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  networkStatus === "online"
                    ? "bg-green-500"
                    : networkStatus === "offline"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  networkStatus === "online"
                    ? "text-green-800"
                    : networkStatus === "offline"
                    ? "text-red-800"
                    : "text-yellow-800"
                }`}
              >
                {networkStatus === "online"
                  ? "Backend Online"
                  : networkStatus === "offline"
                  ? "Backend Offline"
                  : "Checking Connection..."}
              </span>
            </div>

            {networkStatus === "offline" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetryConnection}
                disabled={networkStatus === "checking"}
                className="text-xs h-7 px-2"
              >
                {networkStatus === "checking"
                  ? "Retrying..."
                  : `Retry (${retryCount})`}
              </Button>
            )}
          </div>

          {/* Debug Mode Indicator */}
          {debugMode && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800 font-medium">
                Debug Mode Active
              </span>
            </div>
          )}
        </div>

        <AuthForm
          mode="login"
          onSubmit={handleLogin}
          loading={isLoading}
          error={loginStatus === "error" ? loginMessage : undefined}
          success={loginStatus === "success" ? loginMessage : undefined}
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
              <Link
                href="/forgot-password"
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </AuthForm>

        {/* Login Status Indicator */}
        {loginStatus !== "idle" && (
          <div
            className={`mt-4 p-4 rounded-lg border ${
              loginStatus === "success"
                ? "bg-green-50 border-green-200"
                : loginStatus === "error"
                ? "bg-red-50 border-red-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {loginStatus === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : loginStatus === "error" ? (
                <AlertCircle className="h-5 w-5 text-red-600" />
              ) : (
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    loginStatus === "success"
                      ? "text-green-800"
                      : loginStatus === "error"
                      ? "text-red-800"
                      : "text-blue-800"
                  }`}
                >
                  {loginStatus === "success"
                    ? "Login Successful!"
                    : loginStatus === "error"
                    ? "Login Failed"
                    : "Processing Login..."}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    loginStatus === "success"
                      ? "text-green-700"
                      : loginStatus === "error"
                      ? "text-red-700"
                      : "text-blue-700"
                  }`}
                >
                  {loginMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Debug Information */}
        {debugMode && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Debug Info:
            </h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Email: {email}</p>
              <p>Password Length: {password.length}</p>
              <p>Is Platform Admin: {isPlatformAdmin.toString()}</p>
              <p>Portal Type: {portalType}</p>
              <p>Backend URL: https://genzura.aphezis.com</p>
              <p>Login Hook Loading: {loginHook.loading.toString()}</p>
              <p>
                Platform Login Hook Loading:{" "}
                {platformLoginHook.loading.toString()}
              </p>
              <p>Login Status: {loginStatus}</p>
              <p>Network Status: {networkStatus}</p>
              <p>
                Auth Token:{" "}
                {typeof window !== "undefined"
                  ? localStorage.getItem("token")
                    ? "Present"
                    : "Missing"
                  : "N/A"}
              </p>
              <p>
                Current Path:{" "}
                {typeof window !== "undefined"
                  ? window.location.pathname
                  : "N/A"}
              </p>
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-base text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Connection Error Display */}
        {lastError && networkStatus === "offline" && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  Connection Issue
                </h4>
                <p className="text-sm text-red-700 mb-3">{lastError}</p>
                <div className="flex items-center gap-2 text-xs text-red-600">
                  <span>Retry attempts: {retryCount}</span>
                  <span>•</span>
                  <span>Last check: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Guidance */}
        <div className="mt-8 space-y-4">
          {/* Demo Credentials Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Demo Credentials:
            </h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                <strong>Platform Admin:</strong> admin@genzura.com / admin123
              </p>
              <p>
                <strong>Organization User:</strong> john.doe@democompany.com /
                user123
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Hold Ctrl+Shift+D to toggle debug mode
            </p>
          </div>

          {/* Troubleshooting Guide */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Having trouble logging in?
            </h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• Check your internet connection</p>
              <p>• Verify your email and password</p>
              <p>• Make sure you've selected the correct portal</p>
              <p>• Try refreshing the page if issues persist</p>
            </div>
          </div>

          {/* Connection Status Help */}
          {networkStatus === "offline" && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 className="text-sm font-medium text-orange-800 mb-2">
                Connection Issue Detected
              </h3>
              <div className="text-xs text-orange-700 space-y-1">
                <p>• The backend server is currently unreachable</p>
                <p>• This may be a temporary network issue</p>
                <p>• Try the "Retry Connection" button above</p>
                <p>• Contact support if the problem persists</p>
              </div>
            </div>
          )}
        </div>

        {/* Backend Status Info */}
        {networkStatus === "offline" && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-sm font-medium text-red-700 mb-2">
              ⚠️ Backend Connection Issue
            </h3>
            <div className="text-xs text-red-600 space-y-1">
              <p>• The backend server is currently not accessible</p>
              <p>• Please check your internet connection</p>
              <p>• If the problem persists, contact support</p>
              <p>
                • Visit{" "}
                <a href="/debug" className="underline">
                  Debug Page
                </a>{" "}
                for more information
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
