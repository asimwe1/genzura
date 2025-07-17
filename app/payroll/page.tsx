"use client"

import { useState } from "react"
import { Search, Plus, Filter, Download, Eye, Edit, Calculator, DollarSign, Users, Clock } from "lucide-react"
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

export default function Payroll() {
  const [searchTerm, setSearchTerm] = useState("")
  const [employees, setEmployees] = useState([
    {
      id: "EMP001",
      name: "John Smith",
      position: "Store Manager",
      department: "Management",
      baseSalary: 5500,
      tax: 5500,
      bonus: 500,
      deductions: 200,
      netPay: 5800,
      status: "Processed",
      payDate: "2024-01-31",
    },
    {
      id: "EMP002",
      name: "Sarah Johnson",
      position: "Inventory Specialist",
      department: "Operations",
      baseSalary: 4200,
      tax: 4200,
      bonus: 200,
      deductions: 150,
      netPay: 4250,
      status: "Pending",
      payDate: "2024-01-31",
    },
    {
      id: "EMP003",
      name: "Mike Wilson",
      position: "Sales Associate",
      department: "Sales",
      baseSalary: 3200,
      tax: 4,
      bonus: 150,
      deductions: 120,
      netPay: 3230,
      status: "Processed",
      payDate: "2024-01-31",
    },
    {
      id: "EMP004",
      name: "Emma Davis",
      position: "Accountant",
      department: "Finance",
      baseSalary: 4800,
      tax: 0,
      bonus: 300,
      deductions: 180,
      netPay: 4920,
      status: "Pending",
      payDate: "2024-01-31",
    },
  ])
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    position: "",
    department: "",
    baseSalary: "",
    bonus: "",
    deductions: "",
  })
  const [processing, setProcessing] = useState(false)

  const handleAdd = () => {
    setEmployees([
      ...employees,
      {
        id: `EMP${employees.length + 1}`.padStart(6, "0"),
        name: form.name,
        position: form.position,
        department: form.department,
        baseSalary: Number(form.baseSalary),
        tax: 0,
        bonus: Number(form.bonus),
        deductions: Number(form.deductions),
        netPay: Number(form.baseSalary) + Number(form.bonus) - Number(form.deductions),
        status: "Pending",
        payDate: new Date().toISOString().slice(0, 10),
      },
    ])
    setAddOpen(false)
    setForm({ name: "", position: "", department: "", baseSalary: "", bonus: "", deductions: "" })
    toast({ title: "Employee added", description: "The employee was added successfully." })
  }

  const handleProcessPayroll = () => {
    setProcessing(true)
    setTimeout(() => {
      setEmployees(emps => emps.map(emp => ({ ...emp, status: "Processed" })))
      setProcessing(false)
      toast({ title: "Payroll processed", description: "All employees have been processed." })
    }, 1800)
  }

  const getStatusBadge = (status: string) => {
    return status === "Processed" ? (
      <Badge className="bg-green-100 text-green-800">Processed</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    )
  }

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPayroll = employees.reduce((sum, emp) => sum + emp.netPay, 0)
  const processedCount = employees.filter((emp) => emp.status === "Processed").length
  const pendingCount = employees.filter((emp) => emp.status === "Pending").length

  return (
    <TooltipProvider>
      <ErrorBoundary>
        <div className="flex-1 space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Payroll Management</h1>
              <p className="text-gray-600">Manage employee salaries and payroll processing</p>
            </div>
            <div className="flex space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" aria-label="Process payroll" tabIndex={0} onClick={handleProcessPayroll} disabled={processing}>
                    <Calculator className="h-4 w-4 mr-2" />
                    {processing ? "Processing..." : "Process Payroll"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Process payroll</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700" aria-label="Add new employee" tabIndex={0} onClick={() => setAddOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add new employee</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                    <p className="text-2xl font-bold">${totalPayroll.toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Employees</p>
                    <p className="text-2xl font-bold">{employees.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Processed</p>
                    <p className="text-2xl font-bold text-green-600">{processedCount}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
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
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      aria-label="Search employees"
                    />
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" aria-label="Filter employees" tabIndex={0}>
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Filter employees</TooltipContent>
                  </Tooltip>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" aria-label="Export payroll" tabIndex={0}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Payroll
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export payroll</TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          {/* Payroll Table */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Payroll - January 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg">
                <Table className="min-w-[1000px]">
                  <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900">
                    <TableRow>
                      <TableHead scope="col">Employee ID</TableHead>
                      <TableHead scope="col">Name</TableHead>
                      <TableHead scope="col">Position</TableHead>
                      <TableHead scope="col">Department</TableHead>
                      <TableHead scope="col">Base Salary</TableHead>
                      <TableHead scope="col">Tax</TableHead>
                      <TableHead scope="col">Bonus</TableHead>
                      <TableHead scope="col">Deductions</TableHead>
                      <TableHead scope="col">Net Pay</TableHead>
                      <TableHead scope="col">Status</TableHead>
                      <TableHead scope="col">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.id}</TableCell>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>${employee.baseSalary}</TableCell>
                        <TableCell>{employee.tax}h</TableCell>
                        <TableCell>${employee.bonus}</TableCell>
                        <TableCell>${employee.deductions}</TableCell>
                        <TableCell className="font-bold">${employee.netPay}</TableCell>
                        <TableCell>{getStatusBadge(employee.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" aria-label="Open actions menu" tabIndex={0}>Actions</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" aria-label="View payslip" />
                                View Payslip
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" aria-label="Edit details" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" aria-label="Download payslip" />
                                Download Payslip
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
            <DialogTitle>Add Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input placeholder="Position" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} />
            <Input placeholder="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
            <Input placeholder="Base Salary" type="number" value={form.baseSalary} onChange={e => setForm(f => ({ ...f, baseSalary: e.target.value }))} />
            <Input placeholder="Bonus" type="number" value={form.bonus} onChange={e => setForm(f => ({ ...f, bonus: e.target.value }))} />
            <Input placeholder="Deductions" type="number" value={form.deductions} onChange={e => setForm(f => ({ ...f, deductions: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 w-full">Save Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {processing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center">
            <Calculator className="h-10 w-10 text-blue-600 animate-spin mb-4" />
            <span className="font-semibold text-lg">Processing payroll...</span>
          </div>
        </div>
      )}
    </TooltipProvider>
  )
}
