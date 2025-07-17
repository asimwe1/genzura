"use client"

import { useState } from "react"
import { Search, Plus, Filter, Users, Building2, DollarSign, Package, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

export default function Departments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departments, setDepartments] = useState([
    {
      id: "DEPT001",
      name: "Electronics",
      manager: "John Smith",
      employees: 12,
      budget: 150000,
      spent: 89000,
      products: 245,
      revenue: 320000,
      status: "Active",
      location: "Floor 1, Section A",
    },
    {
      id: "DEPT002",
      name: "Furniture",
      manager: "Sarah Johnson",
      employees: 8,
      budget: 120000,
      spent: 67000,
      products: 89,
      revenue: 180000,
      status: "Active",
      location: "Floor 2, Section B",
    },
    {
      id: "DEPT003",
      name: "Accessories",
      manager: "Mike Wilson",
      employees: 6,
      budget: 80000,
      spent: 45000,
      products: 156,
      revenue: 95000,
      status: "Active",
      location: "Floor 1, Section C",
    },
    {
      id: "DEPT004",
      name: "Office Supplies",
      manager: "Emma Davis",
      employees: 4,
      budget: 60000,
      spent: 23000,
      products: 78,
      revenue: 45000,
      status: "Inactive",
      location: "Floor 3, Section A",
    },
  ])
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    manager: "",
    employees: "",
    budget: "",
    location: "",
    status: "Active",
  })

  const handleAdd = () => {
    setDepartments([
      ...departments,
      {
        id: `DEPT${departments.length + 1}`.padStart(7, "0"),
        name: form.name,
        manager: form.manager,
        employees: Number(form.employees),
        budget: Number(form.budget),
        spent: 0,
        products: 0,
        revenue: 0,
        status: form.status,
        location: form.location,
      },
    ])
    setAddOpen(false)
    setForm({ name: "", manager: "", employees: "", budget: "", location: "", status: "Active" })
    toast({ title: "Department added", description: "The department was added successfully." })
  }

  const getStatusBadge = (status: string) => {
    return status === "Active" ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
    )
  }

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employees, 0)
  const totalBudget = departments.reduce((sum, dept) => sum + dept.budget, 0)
  const totalRevenue = departments.reduce((sum, dept) => sum + dept.revenue, 0)

  return (
    <TooltipProvider>
      <ErrorBoundary>
        <div className="flex-1 space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Departments Management</h1>
              <p className="text-gray-600">Organize and manage your store departments</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" aria-label="Add new department" tabIndex={0} onClick={() => setAddOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add new department</TooltipContent>
            </Tooltip>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Departments</p>
                    <p className="text-2xl font-bold">{departments.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Employees</p>
                    <p className="text-2xl font-bold">{totalEmployees}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Budget</p>
                    <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-orange-600" />
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
                      placeholder="Search departments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      aria-label="Search departments"
                    />
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" aria-label="Filter departments" tabIndex={0}>
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Filter departments</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Departments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg">
                <Table className="min-w-[900px]">
                  <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900">
                    <TableRow>
                      <TableHead scope="col">Department ID</TableHead>
                      <TableHead scope="col">Name</TableHead>
                      <TableHead scope="col">Manager</TableHead>
                      <TableHead scope="col">Employees</TableHead>
                      <TableHead scope="col">Budget</TableHead>
                      <TableHead scope="col">Spent</TableHead>
                      <TableHead scope="col">Products</TableHead>
                      <TableHead scope="col">Revenue</TableHead>
                      <TableHead scope="col">Location</TableHead>
                      <TableHead scope="col">Status</TableHead>
                      <TableHead scope="col">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDepartments.map((dept) => (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.id}</TableCell>
                        <TableCell>{dept.name}</TableCell>
                        <TableCell>{dept.manager}</TableCell>
                        <TableCell>{dept.employees}</TableCell>
                        <TableCell>${dept.budget.toLocaleString()}</TableCell>
                        <TableCell>${dept.spent.toLocaleString()}</TableCell>
                        <TableCell>{dept.products}</TableCell>
                        <TableCell>${dept.revenue.toLocaleString()}</TableCell>
                        <TableCell>{dept.location}</TableCell>
                        <TableCell>{getStatusBadge(dept.status)}</TableCell>
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
                                <Edit className="h-4 w-4 mr-2" aria-label="Edit department" />
                                Edit Department
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="h-4 w-4 mr-2" aria-label="Manage staff" />
                                Manage Staff
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" aria-label="Delete department" />
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
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Department Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input placeholder="Manager" value={form.manager} onChange={e => setForm(f => ({ ...f, manager: e.target.value }))} />
            <Input placeholder="Employees" type="number" value={form.employees} onChange={e => setForm(f => ({ ...f, employees: e.target.value }))} />
            <Input placeholder="Budget" type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
            <Input placeholder="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            <select className="w-full border rounded p-2" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <DialogFooter>
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 w-full">Save Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
