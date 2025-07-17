"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Filter, Download, Eye, Edit, Trash2, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [companyType, setCompanyType] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const type = localStorage.getItem("companyType")
      setCompanyType(type)
      if (type !== "product") {
        toast({
          title: "Access Denied",
          description: "Access to this portal is denied.",
          variant: "destructive",
        })
        router.replace("/")
      }
    }
  }, [router])

  if (companyType && companyType !== "product") {
    return null
  }

  const suppliers = [
    {
      id: "SUP001",
      name: "TechCorp Solutions",
      contact: "John Smith",
      email: "john@techcorp.com",
      phone: "+1 (555) 123-4567",
      address: "123 Tech Street, Silicon Valley, CA",
      category: "Electronics",
      status: "Active",
      totalOrders: 45,
      lastOrder: "2024-01-15",
      rating: 4.8,
    },
    {
      id: "SUP002",
      name: "FurniMax Ltd",
      contact: "Sarah Johnson",
      email: "sarah@furnimax.com",
      phone: "+1 (555) 987-6543",
      address: "456 Furniture Ave, New York, NY",
      category: "Furniture",
      status: "Active",
      totalOrders: 23,
      lastOrder: "2024-01-10",
      rating: 4.5,
    },
    {
      id: "SUP003",
      name: "AccessoryHub",
      contact: "Mike Wilson",
      email: "mike@accessoryhub.com",
      phone: "+1 (555) 456-7890",
      address: "789 Accessory Blvd, Los Angeles, CA",
      category: "Accessories",
      status: "Inactive",
      totalOrders: 12,
      lastOrder: "2023-12-20",
      rating: 3.9,
    },
    {
      id: "SUP004",
      name: "Office Supplies Co",
      contact: "Emma Davis",
      email: "emma@officesupplies.com",
      phone: "+1 (555) 321-0987",
      address: "321 Office Park, Chicago, IL",
      category: "Office Supplies",
      status: "Active",
      totalOrders: 67,
      lastOrder: "2024-01-18",
      rating: 4.7,
    },
  ]

  const getStatusBadge = (status: string) => {
    return status === "Active" ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
    )
  }

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <TooltipProvider>
      <ErrorBoundary>
        <div className="flex-1 space-y-6 p-1 pr-4 md:pr-8 lg:pr-12 xl:pr-16">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Suppliers Management</h1>
              <p className="text-gray-600">Manage your supplier relationships and contacts</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" aria-label="Add new supplier" tabIndex={0}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add new supplier</TooltipContent>
            </Tooltip>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Suppliers</p>
                    <p className="text-2xl font-bold text-green-600">21</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold">147</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold">4.6</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 text-xl">⭐</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search suppliers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      aria-label="Search suppliers"
                    />
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" aria-label="Filter suppliers" tabIndex={0}>
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Filter suppliers</TooltipContent>
                  </Tooltip>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" aria-label="Export suppliers" tabIndex={0}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export suppliers</TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          {/* Suppliers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Supplier Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg">
                <Table className="min-w-[900px]">
                  <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900">
                    <TableRow>
                      <TableHead scope="col">Supplier ID</TableHead>
                      <TableHead scope="col">Company Name</TableHead>
                      <TableHead scope="col">Contact Person</TableHead>
                      <TableHead scope="col">Email</TableHead>
                      <TableHead scope="col">Phone</TableHead>
                      <TableHead scope="col">Category</TableHead>
                      <TableHead scope="col">Orders</TableHead>
                      <TableHead scope="col">Rating</TableHead>
                      <TableHead scope="col">Status</TableHead>
                      <TableHead scope="col">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.id}</TableCell>
                        <TableCell>{supplier.name}</TableCell>
                        <TableCell>{supplier.contact}</TableCell>
                        <TableCell>{supplier.email}</TableCell>
                        <TableCell>{supplier.phone}</TableCell>
                        <TableCell>{supplier.category}</TableCell>
                        <TableCell>{supplier.totalOrders}</TableCell>
                        <TableCell>⭐ {supplier.rating}</TableCell>
                        <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" aria-label="Open actions menu" tabIndex={0}>Actions</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" aria-label="View details" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" aria-label="Edit supplier" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" aria-label="Contact supplier" />
                                Contact
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" aria-label="Delete supplier" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </ErrorBoundary>
    </TooltipProvider>
  )
}
