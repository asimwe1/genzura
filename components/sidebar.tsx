"use client"

import { Building2, FileText, Home, Package, Settings, Truck, Users, Wallet, MoreHorizontal, Crown, Bot } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useState } from "react"

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
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AIChat } from "@/components/ai-chat"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "products",
    url: "/products",
    icon: Package,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "Suppliers",
    url: "/suppliers",
    icon: Truck,
  },
  {
    title: "Manage Store",
    url: "/manage-store",
    icon: Building2,
  },
  {
    title: "Departments",
    url: "/departments",
    icon: Users,
  },
  {
    title: "Payroll",
    url: "/payroll",
    icon: Wallet,
  },
  {
    title: "System Utils",
    url: "/others",
    icon: MoreHorizontal,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "AI Chat",
    url: "/ai-chat",
    icon: Bot,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [aiChatOpen, setAIChatOpen] = useState(false)
  const [aiChatMinimized, setAIChatMinimized] = useState(false)

  const handleAIChatClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setAIChatOpen(true)
    setAIChatMinimized(false)
  }

  return (
    <>
      <Sidebar className="border-r w-[200px]">
        <SidebarHeader className="p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Package className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold">Genzura</span>
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

        <SidebarFooter className="p-4">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="mb-3">
                <Bot className="h-8 w-8 mx-auto text-blue-600" />
              </div>
              <h3 className="font-semibold text-sm mb-1">AI Chat Assistant</h3>
              <p className="text-xs text-gray-600 mb-3">
                Get instant help with inventory, suppliers, reports, and system operations using our AI-powered chat assistant.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setAIChatOpen(true)}>
                Open AI Chat
              </Button>
            </CardContent>
          </Card>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
