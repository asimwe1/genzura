"use client"

import { Bell, Search, Moon, ChevronDown, Plus, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"

export default function Dashboard() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [metricsLoading, setMetricsLoading] = useState(true)
  const [companyType, setCompanyType] = useState('product')
  const [metricsData, setMetricsData] = useState([
    { date: "Jul 1", value: 120 },
    { date: "Jul 2", value: 150 },
    { date: "Jul 3", value: 170 },
    { date: "Jul 4", value: 140 },
    { date: "Jul 5", value: 180 },
    { date: "Jul 6", value: 200 },
    { date: "Jul 7", value: 220 },
  ])

  useEffect(() => {
    setMetricsLoading(true)
    const timer = setTimeout(() => setMetricsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCompanyType(localStorage.getItem('companyType') || 'product')
    }
  }, [])
  
  const handleLogout = () => {
    localStorage.removeItem("isAuth")
    // Force reload to ensure AuthGuard picks up the change
    window.location.href = "/login"
  }

  const upcomingTasks = [
    { title: "Complete Inventory Count", time: "Nov 20, 9:00 AM" },
    { title: "Supplier Meeting", time: "Nov 21, 12:00 PM" },
    { title: "Update Stock Levels", time: "Nov 22, 8:00 AM" },
    { title: "Generate Monthly Report", time: "Nov 23, 11:00 AM" },
  ]

  const teamMembers = [
    { name: "John", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Sarah", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Mike", avatar: "/placeholder.svg?height=32&width=32" },
  ]

  return (
    <TooltipProvider>
      <ErrorBoundary>
        <div className="flex-1 space-y-3 py-2 pr-4 md:pr-8 lg:pr-12 xl:pr-16">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search" className="pl-10 bg-gray-50 border-gray-200" aria-label="Search inventory" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label="View notifications" tabIndex={0}>
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-blue-600">
                      3
                    </Badge>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View notifications</TooltipContent>
              </Tooltip>

              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>RU</AvatarFallback>
                </Avatar>
                <span className="font-medium">RawanUI</span>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark") } aria-label="Toggle theme" tabIndex={0}>
                    <Moon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle light/dark mode</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLogout}
                    className="bg-red-100 hover:bg-red-200 rounded-full p-2 border border-red-300 shadow-md"
                    aria-label="Logout"
                    tabIndex={0}
                  >
                    <LogOut className="h-7 w-7 text-red-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Logout</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Welcome Banner */}
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">Welcome Back, Rio!</h1>
                      <p className="text-blue-100 mb-4">Check your daily {companyType === 'product' ? 'inventory' : 'services'} and schedules</p>
                      <div className="flex space-x-3">
                        <Button className="bg-white text-blue-600 hover:bg-gray-100">
                          <Plus className="h-4 w-4 mr-2" />
                          new task
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                        >
                          Discover
                        </Button>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className="w-32 h-32 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <div className="w-16 h-16 bg-blue-400 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companyType === 'product' ? (
                  <>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-2xl font-bold">6</p>
                            <p className="text-gray-600">/12</p>
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
                        <h3 className="font-semibold mb-4">Low Stock Items</h3>
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
                              strokeDasharray={`${2 * Math.PI * 40}`}
                              strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.6)}`}
                              className="text-purple-600"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">60%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-2xl font-bold">15</p>
                            <p className="text-gray-600">/26</p>
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
                        <h3 className="font-semibold mb-4">Orders Completed</h3>
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
                              strokeDasharray={`${2 * Math.PI * 40}`}
                              strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.9)}`}
                              className="text-blue-600"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">90%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-2xl font-bold">8</p>
                            <p className="text-gray-600">/10</p>
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
                        <h3 className="font-semibold mb-4">Active Services</h3>
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
                              strokeDasharray={`${2 * Math.PI * 40}`}
                              strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.8)}`}
                              className="text-green-600"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">80%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-2xl font-bold">2</p>
                            <p className="text-gray-600">/10</p>
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
                        <h3 className="font-semibold mb-4">Inactive Services</h3>
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
                              strokeDasharray={`${2 * Math.PI * 40}`}
                              strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.2)}`}
                              className="text-red-600"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">20%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>

              {/* Productivity Metrics */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Inventory Metrics</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          Monthly <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Daily</DropdownMenuItem>
                        <DropdownMenuItem>Weekly</DropdownMenuItem>
                        <DropdownMenuItem>Monthly</DropdownMenuItem>
                        <DropdownMenuItem>Yearly</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    {metricsLoading ? (
                      <Skeleton className="w-full h-48 rounded-lg" />
                    ) : (
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={metricsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">2025 - July</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {["S0", "M1", "T2", "W3", "T4", "F5", "S6"].map((day) => (
                      <div key={day} className="p-1 font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 34 }, (_, i) => {
                      const day = i - 1
                      const isToday = day === 14
                      return (
                        <div
                          key={i}
                          className={`p-1 text-sm ${
                            day > 0 && day <= 31
                              ? isToday
                                ? "bg-blue-600 text-white rounded-lg"
                                : "hover:bg-gray-100 rounded-lg cursor-pointer"
                              : "text-gray-300"
                          }`}
                        >
                          {day > 0 && day <= 31 ? day : ""}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-gray-500">{task.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Our Team */}
              <Card>
                <CardHeader className="">
                  <CardTitle>Our Team</CardTitle>
                  <p className="text-sm text-gray-500">Team members</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    {teamMembers.map((member, index) => (
                      <Avatar key={index} className="h-8 w-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                    <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      +12
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Working Time */}
              <Card>
                <CardContent className="p-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold">52 H</p>
                    <p className="text-sm text-gray-500">Total Working time</p>
                    <p className="text-xs text-gray-400">In a week</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="flex h-[2rem] items-center justify-between py-[0.5rem] border-t text-sm text-gray-500">
            <div className="flex space-x-6">
              <a href="#" className="hover:text-gray-700">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-700">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-700">
                Help Center
              </a>
            </div>
            <p>© {new Date().getFullYear()} Genzura. All rights reserved.</p>
          </div>
        </div>
      </ErrorBoundary>
    </TooltipProvider>
  )
}
