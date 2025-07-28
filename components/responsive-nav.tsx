"use client"

import { useState } from "react"
import { Package, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

interface ResponsiveNavProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  iconBgColor: string
  menuItems: NavItem[]
}

export function ResponsiveNav({ title, icon: Icon, iconBgColor, menuItems }: ResponsiveNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Top Navigation Bar - Only visible on mobile */}
      <div className="md:hidden sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-4">
                    {/* Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="p-6 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", iconBgColor)}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  {title}
                </SheetTitle>
              </SheetHeader>
              <div className="p-4">
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.url}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        pathname === item.url
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", iconBgColor)}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold">{title}</span>
          </div>

        </div>
      </div>
    </>
  )
}
