"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/sidebar";
import { ProductSidebar } from "@/components/product-sidebar";
import { ServiceSidebar } from "@/components/service-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ResponsiveNav } from "@/components/responsive-nav";
import { Package, Wrench, Home, Building2, FileText, Truck, Users, Wallet, MoreHorizontal, Settings, Bot } from "lucide-react";

// Menu items for each portal
const productMenuItems = [
  { title: "Dashboard", url: "/product", icon: Home },
  { title: "Products", url: "/product/products", icon: Package },
  { title: "Suppliers", url: "/product/suppliers", icon: Truck },
  { title: "Reports", url: "/product/reports", icon: FileText },
  { title: "Manage Store", url: "/product/manage-store", icon: Building2 },
  { title: "Departments", url: "/product/departments", icon: Users },
  { title: "Payroll", url: "/product/payroll", icon: Wallet },
  { title: "System Utils", url: "/product/others", icon: MoreHorizontal },
  { title: "Settings", url: "/product/settings", icon: Settings },
  { title: "AI Chat", url: "/product/ai-chat", icon: Bot },
];

const serviceMenuItems = [
  { title: "Dashboard", url: "/service", icon: Home },
  { title: "Services", url: "/service/services", icon: Wrench },
  { title: "Reports", url: "/service/reports", icon: FileText },
  { title: "Departments", url: "/service/departments", icon: Users },
  { title: "Payroll", url: "/service/payroll", icon: Wallet },
  { title: "System Utils", url: "/service/others", icon: MoreHorizontal },
  { title: "Settings", url: "/service/settings", icon: Settings },
  { title: "AI Chat", url: "/service/ai-chat", icon: Bot },
];

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

  // Public routes
  const publicRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isProductPublic = pathname.startsWith("/product");
  const isServicePublic = pathname.startsWith("/service");

  // Allow non-authenticated users to access /product/* and /service/*
  if (!isAuth && (isProductPublic || isServicePublic)) {
    return <>{children}</>;
  }

  // Show login/signup/forgot-password pages if not authenticated and on a public route
  if (checked && !isAuth && isPublicRoute) {
    return <>{children}</>;
  }

  // Show dashboard with appropriate sidebar if authenticated and not on a public route
  if (checked && isAuth && !isPublicRoute) {
    const isProductPortal = pathname.startsWith("/product") || (pathname === "/" && userPortal === "product");
    const isServicePortal = pathname.startsWith("/service") || (pathname === "/" && userPortal === "service");
    
    let SidebarComponent = AppSidebar; // Default fallback
    let mobileNavProps = null;
    
    if (isProductPortal) {
      SidebarComponent = ProductSidebar;
      mobileNavProps = {
        title: "Product Portal",
        icon: Package,
        iconBgColor: "bg-blue-600",
        menuItems: productMenuItems
      };
    } else if (isServicePortal) {
      SidebarComponent = ServiceSidebar;
      mobileNavProps = {
        title: "Service Portal", 
        icon: Wrench,
        iconBgColor: "bg-green-600",
        menuItems: serviceMenuItems
      };
    }
    
    return (
      <>
        {/* Mobile Navigation - Always visible on mobile */}
        {mobileNavProps && (
          <ResponsiveNav 
            title={mobileNavProps.title}
            icon={mobileNavProps.icon}
            iconBgColor={mobileNavProps.iconBgColor}
            menuItems={mobileNavProps.menuItems}
          />
        )}
        
        {/* Desktop Layout */}
        <SidebarProvider>
          <SidebarComponent />
          <SidebarInset className="md:ml-0">{children}</SidebarInset>
        </SidebarProvider>
      </>
    );
  }

  // Show loading while redirecting or in any other ambiguous state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
} 