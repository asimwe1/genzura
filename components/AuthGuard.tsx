"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/sidebar";
import { ProductSidebar } from "@/components/product-sidebar";
import { ServiceSidebar } from "@/components/service-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [checked, setChecked] = useState(false);
  const [userPortal, setUserPortal] = useState("product");

  // Check auth status on mount and when pathname changes
  const checkAuth = () => {
    if (typeof window !== "undefined") {
      const authStatus = localStorage.getItem("isAuth") === "true";
      const portal = localStorage.getItem("userPortal") || "product";
      setIsAuth(authStatus);
      setUserPortal(portal);
      setChecked(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!checked) return;

    // Public routes that don't require authentication
    const publicRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];
    const isPublicRoute = publicRoutes.includes(pathname);

    // If not authenticated and not on a public route, redirect to login
    if (!isAuth && !isPublicRoute) {
      router.replace("/login");
      return;
    }

    // If authenticated and on a public route, redirect to appropriate portal
    if (isAuth && isPublicRoute) {
      router.replace(userPortal === "service" ? "/service" : "/product");
      return;
    }

    // If authenticated and on root path, redirect to appropriate portal
    if (isAuth && pathname === "/") {
      router.replace(userPortal === "service" ? "/service" : "/product");
      return;
    }
  }, [isAuth, checked, pathname, router, userPortal]);

  // Show loading while checking auth
  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show login/signup/forgot-password pages if not authenticated
  if (!isAuth && ["/login", "/signup", "/forgot-password", "/reset-password"].includes(pathname)) {
    return <>{children}</>;
  }

  // Show dashboard with appropriate sidebar if authenticated
  if (isAuth) {
    const isProductPortal = pathname.startsWith("/product") || (pathname === "/" && userPortal === "product");
    const isServicePortal = pathname.startsWith("/service") || (pathname === "/" && userPortal === "service");
    
    let SidebarComponent = AppSidebar; // Default fallback
    
    if (isProductPortal) {
      SidebarComponent = ProductSidebar;
    } else if (isServicePortal) {
      SidebarComponent = ServiceSidebar;
    }

    return (
      <SidebarProvider>
        <SidebarComponent />
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