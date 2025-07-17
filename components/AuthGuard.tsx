"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [checked, setChecked] = useState(false);

  // Check auth status on mount and when pathname changes
  const checkAuth = () => {
    if (typeof window !== "undefined") {
      const authStatus = localStorage.getItem("isAuth") === "true";
      setIsAuth(authStatus);
      setChecked(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!checked) return;

    // Always redirect to login if not authenticated and not on login/signup/forgot-password
    if (!isAuth && pathname !== "/login" && pathname !== "/signup" && pathname !== "/forgot-password") {
      router.replace("/login");
      return;
    }

    // Redirect to dashboard if authenticated and on login/signup/forgot-password
    if (isAuth && (pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password")) {
      router.replace("/");
      return;
    }
  }, [isAuth, checked, pathname, router]);

  // Show loading while checking auth
  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show login/signup/forgot-password pages if not authenticated
  if (!isAuth && (pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password")) {
    return <>{children}</>;
  }

  // Show dashboard with sidebar if authenticated
  if (isAuth) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    );
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
} 