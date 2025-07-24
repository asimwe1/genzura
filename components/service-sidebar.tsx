"use client"

import { 
  Building2, 
  FileText, 
  Home, 
  Settings, 
  Users, 
  Wallet, 
  MoreHorizontal, 
  Bot, 
  Crown, 
  Inventory, 
  Car,
  Wrench
} from "lucide-react"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import BaseSidebar from "@/components/ui/BaseSidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/service",
    icon: Home,
  },
  {
    title: "Services",
    url: "/service/services",
    icon: Wrench,
  },
  {
    title: "Reports",
    url: "/service/reports",
    icon: FileText,
  },
  {
    title: "Departments",
    url: "/service/departments",
    icon: Users,
  },
  {
    title: "Payroll",
    url: "/service/payroll",
    icon: Wallet,
  },
  {
    title: "System Utils",
    url: "/service/others",
    icon: MoreHorizontal,
  },
  {
    title: "Settings",
    url: "/service/settings",
    icon: Settings,
  },
  {
    title: "AI Chat",
    url: "/service/ai-chat",
    icon: Bot,
  },
]

export function ServiceSidebar() {
  const [showUpgrade, setShowUpgrade] = useState(false);
  return (
    <>
      <BaseSidebar
        menuItems={menuItems}
        headerIcon={<Settings className="h-4 w-4 text-white bg-blue-600 rounded-lg p-1" />}
        headerTitle="Service System"
        footer={
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300">
            <CardContent className="p-4 text-center">
              <div className="mb-3">
                <Crown className="h-8 w-8 mx-auto text-blue-500" />
              </div>
              <h3 className="font-semibold text-sm mb-1 text-blue-800">Upgrade to Premium with AI analysis</h3>
              <p className="text-xs text-blue-700 mb-3">Unlock advanced analytics, AI-powered insights, and premium support for your service operations.</p>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => setShowUpgrade(true)}>
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        }
      />
      <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-700">
              <Crown className="h-6 w-6 text-blue-500" />
              Upgrade to Genzura Premium
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 text-center">
            <p className="text-base font-semibold mb-2">Supercharge your business with AI!</p>
            <ul className="text-sm text-gray-700 mb-4 space-y-1 text-left mx-auto max-w-xs">
              <li>• AI-powered analytics and reporting</li>
              <li>• Smart service and client insights</li>
              <li>• Priority customer support</li>
              <li>• Early access to new features</li>
              <li>• Custom integrations</li>
              <li>• And much more...</li>
            </ul>
            <p className="text-xs text-gray-500">Contact our sales team to discuss your needs and get a personalized offer.</p>
          </div>
          <DialogFooter className="flex flex-col gap-2">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => { setShowUpgrade(false); window.location.href = 'mailto:sales@genzura.com?subject=Upgrade%20to%20Premium'; }}>
              Contact Sales
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setShowUpgrade(false)}>
              Maybe Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 