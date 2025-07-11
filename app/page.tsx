"use client"

import { Bell, Search, Moon, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Dashboard() {
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
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search" className="pl-10 bg-gray-50 border-gray-200" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-blue-600">
              3
            </Badge>
          </Button>

          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>RU</AvatarFallback>
            </Avatar>
            <span className="font-medium">RawanUI</span>
          </div>

          <Button variant="ghost" size="icon">
            <Moon className="h-5 w-5" />
          </Button>
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
                  <p className="text-blue-100 mb-4">Check your daily inventory and schedules</p>
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
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold">6</p>
                    <p className="text-gray-600">/12</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
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
                  <Button variant="ghost" size="icon">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
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
                <p className="text-gray-500">Chart visualization would go here</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">2024</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <div key={day} className="p-2 font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 4
                  const isToday = day === 19
                  return (
                    <div
                      key={i}
                      className={`p-2 text-sm ${
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
            <CardContent className="space-y-3">
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
            <CardHeader>
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
      <div className="flex items-center justify-between pt-6 border-t text-sm text-gray-500">
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
        <p>© 2024 ProServe. All rights reserved.</p>
      </div>
    </div>
  )
}
