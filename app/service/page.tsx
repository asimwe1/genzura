"use client"

import { Bell, Search, Moon, ChevronDown, Plus, LogOut, Settings, FileText, Bot, Users, Wallet, MoreHorizontal, Building2, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import OfflineBanner from "@/components/OfflineBanner"

export default function ServicePortal() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [metricsLoading, setMetricsLoading] = useState(true)
  const [metricsData, setMetricsData] = useState([
    { date: "Jul 1", value: 85 },
    { date: "Jul 2", value: 92 },
    { date: "Jul 3", value: 88 },
    { date: "Jul 4", value: 95 },
    { date: "Jul 5", value: 89 },
    { date: "Jul 6", value: 91 },
    { date: "Jul 7", value: 94 },
  ])

  const [serviceData] = useState([
    { name: "Consulting", value: 40, color: "#0088FE" },
    { name: "Support", value: 30, color: "#00C49F" },
    { name: "Training", value: 20, color: "#FFBB28" },
    { name: "Implementation", value: 10, color: "#FF8042" },
  ])

  const [recentServices] = useState([
    { name: "IT Consulting", status: "Active", revenue: "$2,500" },
    { name: "Technical Support", status: "Completed", revenue: "$800" },
    { name: "Training Session", status: "Scheduled", revenue: "$1,200" },
    { name: "System Implementation", status: "In Progress", revenue: "$5,000" },
  ])

  useEffect(() => {
    setMetricsLoading(true)
    const timer = setTimeout(() => setMetricsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])
  
  const handleLogout = () => {
    localStorage.removeItem("isAuth")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userPortal")
    window.location.href = "/login"
  }

  const upcomingTasks = [
    { title: "Client Meeting", time: "Nov 20, 10:00 AM" },
    { title: "Service Review", time: "Nov 21, 2:00 PM" },
    { title: "Training Session", time: "Nov 22, 9:00 AM" },
    { title: "Project Delivery", time: "Nov 23, 3:00 PM" },
  ]

  const teamMembers = [
    { name: "Alex", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Emma", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "David", avatar: "/placeholder.svg?height=32&width=32" },
  ]

  return (
    <>
      <OfflineBanner portalType="Service Portal" />
      <TooltipProvider>
        <div className="flex-1 space-y-3 p-2 sm:p-4 md:pr-8 lg:pr-12 xl:pr-8 xl:pl-8 md:pt-4 pt-2">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="w-full sm:w-auto sm:max-w-md sm:flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search services..." className="pl-10 bg-gray-50 border-gray-200 w-full" aria-label="Search services" />
            </div>
          </div>

          {/* Action Items */}
          <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-2 lg:space-x-4">
            {/* User Info - Hidden on small mobile, shown on tablet+ */}
            <div className="hidden sm:flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>RU</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm lg:text-base">Service Portal</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Notifications */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10" aria-label="View notifications" tabIndex={0}>
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center bg-blue-600 text-xs">
                      5
                    </Badge>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View notifications</TooltipContent>
              </Tooltip>

              {/* Theme Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark") } aria-label="Toggle theme" tabIndex={0} className="h-9 w-9 sm:h-10 sm:w-10">
                    <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle light/dark mode</TooltipContent>
              </Tooltip>

              {/* Mobile User Avatar - Only on mobile */}
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="User menu">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" />
                        <AvatarFallback className="text-xs">RU</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem disabled>
                      <span className="font-medium">Service Portal</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Desktop Logout - Hidden on mobile */}
              <div className="hidden sm:block">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleLogout}
                      className="bg-red-100 hover:bg-red-200 rounded-full p-2 border border-red-300 shadow-md h-9 w-9 sm:h-10 sm:w-10"
                      aria-label="Logout"
                      tabIndex={0}
                    >
                      <LogOut className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Logout</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-4 sm:space-y-6">
            {/* Welcome Banner */}
            <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-xl sm:text-2xl font-bold mb-2">Welcome to Service Portal!</h1>
                    <p className="text-blue-100 mb-4 text-sm sm:text-base">Manage your services, clients, and operations</p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button className="bg-white text-blue-600 hover:bg-gray-100 text-sm sm:text-base">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent text-sm sm:text-base"
                        onClick={() => router.push('/service/reports')}
                      >
                        View Reports
                      </Button>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Settings className="w-12 h-12 sm:w-16 sm:h-16 text-blue-300" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold">94%</p>
                      <p className="text-gray-600">Satisfaction</p>
                    </div>
                    <Button asChild variant="ghost" size="icon">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="flex flex-col space-y-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Export</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Button>
                  </div>
                  <h3 className="font-semibold mb-4">Client Satisfaction</h3>
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-blue-600"
                        strokeDasharray="251.2"
                        strokeDashoffset="15.072"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">94%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold">$8,750</p>
                      <p className="text-gray-600">+18%</p>
                    </div>
                    <Button asChild variant="ghost" size="icon">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="flex flex-col space-y-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Export</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Button>
                  </div>
                  <h3 className="font-semibold mb-4">Service Revenue</h3>
                  <div className="h-24">
                    {metricsLoading ? (
                      <Skeleton className="w-full h-full" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metricsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {metricsLoading ? (
                      <Skeleton className="w-full h-full" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metricsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Bar dataKey="value" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {metricsLoading ? (
                      <Skeleton className="w-full h-full" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={serviceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {serviceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Services */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentServices.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Settings className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-gray-500">Status: {service.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{service.revenue}</p>
                        <p className="text-sm text-gray-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => router.push('/service/services')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push('/service/reports')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push('/service/ai-chat')}>
                  <Bot className="w-4 h-4 mr-2" />
                  AI Assistant
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push('/service/departments')}>
                  <Building2 className="w-4 h-4 mr-2" />
                  Manage Departments
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-gray-500">{task.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{member.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
        </TooltipProvider>
      </>
    )
} 