"use client"

import { Bell, Search, Moon, ChevronDown, Plus, LogOut, Package, Truck, FileText, Bot, Settings, Users, Wallet, MoreHorizontal, Menu } from "lucide-react"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import OfflineBanner from "@/components/OfflineBanner"

export default function ProductPortal() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [metricsLoading, setMetricsLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [metricsData, setMetricsData] = useState([
    { date: "Jul 1", value: 120 },
    { date: "Jul 2", value: 150 },
    { date: "Jul 3", value: 170 },
    { date: "Jul 4", value: 140 },
    { date: "Jul 5", value: 180 },
    { date: "Jul 6", value: 200 },
    { date: "Jul 7", value: 220 },
  ])

  const [supplierData] = useState([
    { name: "TechCorp", value: 35, color: "#0088FE" },
    { name: "SupplyMax", value: 25, color: "#00C49F" },
    { name: "GlobalParts", value: 20, color: "#FFBB28" },
    { name: "QualityFirst", value: 20, color: "#FF8042" },
  ])

  const [recentProducts] = useState([
    { name: "Laptop Pro", stock: 45, price: "$1,299" },
    { name: "Wireless Mouse", stock: 120, price: "$29" },
    { name: "USB Cable", stock: 200, price: "$12" },
    { name: "Monitor 24\"", stock: 15, price: "$249" },
  ])

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    supplier: "",
    sku: ""
  })

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

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!productForm.name || !productForm.price || !productForm.stock) {
      toast.error("Please fill in all required fields")
      return
    }
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Product added successfully!")
      console.log("Added product:", productForm)
      setShowAddProduct(false)
      setProductForm({
        name: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        supplier: "",
        sku: ""
      })
    }, 1000)
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
    <>
      <OfflineBanner portalType="Product Portal" />
      <TooltipProvider>
        <div className="flex-1 space-y-3 p-2 sm:p-4 md:pr-4 lg:pr-6 xl:pr-8 md:pt-4 pt-2">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="w-full sm:w-auto sm:max-w-md sm:flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search products..." className="pl-10 bg-gray-50 border-gray-200 w-full" aria-label="Search products" />
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
              <span className="font-medium text-sm lg:text-base">Product Portal</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Notifications */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10" aria-label="View notifications" tabIndex={0}>
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center bg-blue-600 text-xs">
                      3
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
                      <span className="font-medium">Product Portal</span>
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
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-xl sm:text-2xl font-bold mb-2">Welcome to Product Portal!</h1>
                    <p className="text-blue-100 mb-4 text-sm sm:text-base">Manage your inventory, suppliers, and product catalog</p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
                        <DialogTrigger asChild>
                          <Button className="bg-white text-blue-600 hover:bg-gray-100 text-sm sm:text-base">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                            <DialogDescription>
                              Fill in the details below to add a new product to your inventory.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleAddProduct} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Product Name *</Label>
                              <Input
                                id="name"
                                value={productForm.name}
                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                placeholder="Enter product name"
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={productForm.description}
                                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                placeholder="Enter product description"
                                rows={3}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={productForm.category} onValueChange={(value) => setProductForm({ ...productForm, category: value })}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Electronics">Electronics</SelectItem>
                                    <SelectItem value="Furniture">Furniture</SelectItem>
                                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                                    <SelectItem value="Accessories">Accessories</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="sku">SKU</Label>
                                <Input
                                  id="sku"
                                  value={productForm.sku}
                                  onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                                  placeholder="Enter SKU"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="price">Price *</Label>
                                <Input
                                  id="price"
                                  type="number"
                                  value={productForm.price}
                                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                  placeholder="0.00"
                                  required
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="stock">Stock Quantity *</Label>
                                <Input
                                  id="stock"
                                  type="number"
                                  value={productForm.stock}
                                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                                  placeholder="0"
                                  required
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="supplier">Supplier</Label>
                              <Select value={productForm.supplier} onValueChange={(value) => setProductForm({ ...productForm, supplier: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select supplier" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="TechCorp">TechCorp</SelectItem>
                                  <SelectItem value="SupplyMax">SupplyMax</SelectItem>
                                  <SelectItem value="GlobalParts">GlobalParts</SelectItem>
                                  <SelectItem value="QualityFirst">QualityFirst</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex space-x-2 pt-4">
                              <Button type="submit" className="flex-1">
                                Add Product
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowAddProduct(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent text-sm sm:text-base"
                        onClick={() => router.push('/product/suppliers')}
                      >
                        Manage Suppliers
                      </Button>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Package className="w-12 h-12 sm:w-16 sm:h-16 text-blue-300" />
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
                        className="text-blue-600"
                        strokeDasharray="251.2"
                        strokeDashoffset="125.6"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">50%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold">$12,450</p>
                      <p className="text-gray-600">+12%</p>
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
                  <h3 className="font-semibold mb-4">Total Revenue</h3>
                  <div className="h-24">
                    {metricsLoading ? (
                      <Skeleton className="w-full h-full" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metricsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
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
                  <CardTitle>Product Sales Trend</CardTitle>
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
                          <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Supplier Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {metricsLoading ? (
                      <Skeleton className="w-full h-full" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={supplierData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {supplierData.map((entry, index) => (
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

            {/* Recent Products */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gray-500">Stock: {product.stock} units</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{product.price}</p>
                        <p className="text-sm text-gray-500">Price</p>
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
                <Button className="w-full" onClick={() => setShowAddProduct(true)}>
                  <Package className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push('/product/suppliers')}>
                  <Truck className="w-4 h-4 mr-2" />
                  Manage Suppliers
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push('/product/reports')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push('/product/ai-chat')}>
                  <Bot className="w-4 h-4 mr-2" />
                  AI Assistant
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