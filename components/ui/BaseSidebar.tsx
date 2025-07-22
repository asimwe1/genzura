import React from "react";
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
}: {
  menuItems: Array<{ title: string; url: string; icon: React.ElementType }>;
  headerIcon: React.ReactNode;
  headerTitle: string;
  footer?: React.ReactNode;
  className?: string;
}) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  return (
    <Sidebar className={"border-r w-[200px] bg-sidebar text-sidebar-foreground dark:bg-sidebar dark:text-sidebar-foreground " + (className || "") }>
      <SidebarHeader className="p-3 border-b border-sidebar-border dark:border-sidebar-border bg-sidebar dark:bg-sidebar">
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
      {footer && <SidebarFooter className="p-4">{footer}</SidebarFooter>}
    </Sidebar>
  );
} 