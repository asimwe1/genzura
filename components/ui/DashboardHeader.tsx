import React from "react";
import { Bell, Moon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

/**
 * DashboardHeader is a reusable header for dashboard pages.
 *
 * Props:
 * - username: string
 * - avatarUrl?: string
 * - theme: string
 * - setTheme: (theme: string) => void
 * - children?: React.ReactNode (for extra actions)
 */
export default function DashboardHeader({
  username,
  avatarUrl = "/placeholder.svg?height=32&width=32",
  theme,
  setTheme,
  children,
}: {
  username: string;
  avatarUrl?: string;
  theme: string;
  setTheme: (theme: string) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between pt-6 sm:pt-8 md:pt-4">
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search..." className="pl-10 bg-gray-50 border-gray-200" aria-label="Search" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="View notifications" tabIndex={0}>
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-blue-600 text-white">5</Badge>
            </Button>
          </TooltipTrigger>
          <TooltipContent>View notifications</TooltipContent>
        </Tooltip>
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{username?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{username}</span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark") } aria-label="Toggle theme" tabIndex={0}>
              <Moon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle light/dark mode</TooltipContent>
        </Tooltip>
        {children}
      </div>
    </div>
  );
} 