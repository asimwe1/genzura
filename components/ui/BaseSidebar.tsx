import React, { useState } from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import LogoutConfirmation from "@/components/LogoutConfirmation";

/**
 * BaseSidebar is a reusable sidebar for all portals.
 *
 * Props:
 * - menuItems: Array<{ title: string; url: string; icon: React.ElementType }>
 * - headerIcon: React.ReactNode
 * - headerTitle: string
 * - footer?: React.ReactNode
 * - className?: string
 */
export default function BaseSidebar({
  menuItems,
  headerIcon,
  headerTitle,
  footer,
  className,
  portalType,
}: {
  menuItems: Array<{ title: string; url: string; icon: React.ElementType }>;
  headerIcon: React.ReactNode;
  headerTitle: string;
  footer?: React.ReactNode;
  className?: string;
  portalType?: string;
}) {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  
  return (
    <Sidebar className={"w-[200px] bg-background text-sidebar-foreground dark:bg-background dark:text-sidebar-foreground p-1 " + (className || "") }>
      <SidebarHeader className="border-b border-sidebar-border dark:border-sidebar-border bg-background dark:bg-background p-1">
        <div className="flex items-center gap-2">
          {headerIcon}
          <span className="text-xl font-bold">{headerTitle}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} className="w-full h-[2.5rem] justify-start">
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-1">
        {footer && <div className="mb-2">{footer}</div>}
        <Button
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          onClick={() => setShowLogoutConfirmation(true)}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
      
      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
        portalType={portalType}
      />
    </Sidebar>
  );
} 