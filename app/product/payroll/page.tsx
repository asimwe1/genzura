"use client"

import React, { useState, useEffect } from "react"
import { Search, Plus, Download, Eye, Edit, Calculator, DollarSign, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { generateEmployeesCSV, generatePayrollCSV } from "@/lib/exportUtils"
import FilterDialog from "@/components/FilterDialog"
import { calculatePayDate, calculateTotalPayroll } from "@/lib/payrollUtils"

interface Employee {
  id: number
  name: string
  position: string
  branch: string
  baseSalary: number
  tax: number
  bonus: number
  deductions: number
  netPay: number
  status: string
  payDate: string
  hireDate: string
}

interface Branch {
  id: number
  name: string
}

interface FilterState {
  branchId: string
  status: string
  payDateStart: string
  payDateEnd: string
}

export default function Payroll() {
  const [searchTerm, setSearchTerm] = useState("")
  const [payroll, setPayroll] = useState<Employee[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showProcess, setShowProcess] = useState(false)
  const [filter, setFilter] = useState<FilterState>({
    branchId: "",
    status: "",
    payDateStart: "",
    payDateEnd: ""
  })
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    job_title: "",
    branch_id: "",
    basic_salary: "",
    tax: "",
    bonus: "",
    deductions: "",
    status: "Pending",
    hire_date: ""
  })

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://genzura.aphezis.com"
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const currentPayrollMonth = "2025-01" // Hardcoded for January 2025
  const currentDate = new Date(2025, 7, 31) // August 31, 2025

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      if (!token) return

      try {
        const branchesUrl = baseUrl.replace(/\/+$/, "") + "/branches"
        const response = await fetch(branchesUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch branches: ${response.status}`)
        }
        const result = await response.json()
        if (result.ret !== 1 || !Array.isArray(result.data)) {
          throw new Error("Invalid response structure from API")
        }
        setBranches(result.data.map((item: { id: number; name: string }) => ({ id: item.id, name: item.name })))
      } catch (err) {
        console.error("Error fetching branches:", err)
        toast.error("Failed to fetch branches")
      }
    }
    fetchBranches()
  }, [baseUrl, token])

  // Fetch all organization employees
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!token) {
        setError("No authentication token found. Please log in.")
        setLoading(false)
        toast.error("Please log in to access employee data")
        return
      }

      setLoading(true)
      try {
        const employeesUrl = baseUrl.replace(/\/+$/, "") + "/employees"
        const response = await fetch(employeesUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized: Invalid or expired token")
          }
          throw new Error(`Failed to fetch employees: ${response.status}`)
        }
        const result = await response.json()
        if (result.ret !== 1 || !Array.isArray(result.data)) {
          throw new Error("Invalid response structure from API")
        }
        setPayroll(result.data
          .filter((item: { hire_date: string }) => item.hire_date && item.hire_date <= "2025-01-31")
          .map(item => ({
            id: item.id,
            name: `${item.first_name} ${item.last_name}`,
            position: item.job_title || "N/A",
            branch: branches.find(b => b.id === item.branch_id)?.name || "N/A",
            baseSalary: Number(item.basic_salary) || 0,
            tax: Number(item.tax || 0),
            bonus: Number(item.bonus || 0),
            deductions: Number(item.deductions || 0),
            netPay: Number(item.basic_salary || 0) + Number(item.bonus || 0) - Number(item.deductions || 0) - Number(item.tax || 0),
            status: item.status || "Pending",
            payDate: calculatePayDate(item.hire_date, currentPayrollMonth),
            hireDate: item.hire_date || "N/A"
          })))
        setLoading(false)
      } catch (err) {
        console.error("Error fetching employees:", err)
        let errorMessage = "An unknown error occurred"
        if (err instanceof Error) {
          errorMessage = err.message
        } else if (typeof err === "string") {
          errorMessage = err
        }
        setError(errorMessage)
        setLoading(false)
        toast.error(`Failed to fetch employee data: ${errorMessage}`)
      }
    }
    if (branches.length > 0) {
      fetchEmployees()
    }
  }, [baseUrl, token, branches])

  const getStatusBadge = (status: string) => {
    return status === "Processed" ? (
      <Badge className="bg-green-100 text-green-800">Processed</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    )
  }

  const filteredEmployees = payroll.filter(
    (employee) =>
      (employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
       employee.branch.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filter.branchId === "" || filter.branchId === "all" || employee.branch === branches.find(b => b.id === Number(filter.branchId))?.name) &&
      (filter.status === "" || filter.status === "all" || employee.status === filter.status) &&
      (!filter.payDateStart || employee.payDate >= filter.payDateStart) &&
      (!filter.payDateEnd || employee.payDate <= filter.payDateEnd)
  )

  const totalPayroll = calculateTotalPayroll(payroll, currentDate)
  const processedCount = filteredEmployees.filter((emp) => emp.status === "Processed").length
  const pendingCount = filteredEmployees.filter((emp) => emp.status === "Pending").length

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      toast.error("Please log in to add employees")
      return
    }
    if (!form.first_name || !form.last_name || !form.job_title || !form.branch_id || !form.basic_salary || !form.tax || !form.bonus || !form.deductions || !form.hire_date) {
      toast.error("Please fill in all fields")
      return
    }
    if (form.hire_date > "2025-01-31") {
      toast.error("Hire date must be on or before January 31, 2025")
      return
    }
    try {
      const employeesUrl = baseUrl.replace(/\/+$/, "") + "/employees"
      console.log("Creating employee with data:", form)
      const response = await fetch(employeesUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: `${form.first_name.toLowerCase()}.${form.last_name.toLowerCase()}@democompany.com`,
          phone: "+1-555-0123",
          job_title: form.job_title.trim(),
          branch_id: Number(form.branch_id),
          basic_salary: Number(form.basic_salary).toFixed(2),
          hire_date: form.hire_date
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.msg || `Failed to create employee: ${response.status}`)
      }
      const newEmployee = await response.json()
      console.log("Employee created successfully:", newEmployee)
      if (newEmployee.ret !== 1 || !newEmployee.data) {
        throw new Error("Invalid response structure from API")
      }
      const netPay = Number(form.basic_salary) + Number(form.bonus) - Number(form.deductions) - Number(form.tax)
      setPayroll([
        ...payroll,
        {
          id: newEmployee.data.id,
          name: `${form.first_name} ${form.last_name}`,
          position: form.job_title,
          branch: branches.find(b => b.id === Number(form.branch_id))?.name || "N/A",
          baseSalary: Number(form.basic_salary),
          tax: Number(form.tax),
          bonus: Number(form.bonus),
          deductions: Number(form.deductions),
          netPay,
          status: form.status,
          payDate: calculatePayDate(form.hire_date, currentPayrollMonth),
          hireDate: form.hire_date
        }
      ])
      setForm({ first_name: "", last_name: "", job_title: "", branch_id: "", basic_salary: "", tax: "", bonus: "", deductions: "", status: "Pending", hire_date: "" })
      setShowAdd(false)
      toast.success("Employee added to payroll!")
    } catch (err) {
      console.error("Error adding employee:", err)
      let errorMsg = "Failed to add employee"
      if (err instanceof Error) {
        errorMsg = `Failed to add employee: ${err.message}`
      }
      toast.error(errorMsg)
    }
  }

  const handleProcessPayroll = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      toast.error("Please log in to process payroll")
      return
    }
    try {
      setPayroll(payroll.map(emp => ({ ...emp, status: "Processed" })))
      setShowProcess(false)
      toast.success("Payroll processed successfully! (Client-side simulation)")
    } catch (err) {
      console.error("Error processing payroll:", err)
      toast.error("Payroll processing not implemented yet")
    }
  }

  const handleEdit = (id: number) => {
    toast.info(`Edit Employee ${id} (placeholder)`)
  }

  const handleDownload = (id: number) => {
    toast.success(`Payslip for ${id} downloaded (placeholder)`)
  }

  const handleExportPayroll = () => {
    generatePayrollCSV(filteredEmployees)
  }

  const handleExportEmployees = () => {
    generateEmployeesCSV(filteredEmployees)
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>
  }

  return (
    <div className="flex-1 md:w-[64.5rem] space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-gray-600">Manage employee salaries and payroll processing</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showProcess} onOpenChange={setShowProcess}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={!token}>
                <Calculator className="h-4 w-4 mr-2" />
                Process Payroll
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Process Payroll</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleProcessPayroll} className="space-y-4">
                <p className="text-gray-600">This will process payroll for all pending employees. Are you sure?</p>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowProcess(false)}>Cancel</Button>
                  <Button type="submit">Process</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700" disabled={!token}>
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Employee</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input value={form.job_title} onChange={e => setForm(f => ({ ...f, job_title: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Branch</Label>
                    <Select value={form.branch_id} onValueChange={value => setForm(f => ({ ...f, branch_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map(branch => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Base Salary</Label>
                    <Input type="number" value={form.basic_salary} onChange={e => setForm(f => ({ ...f, basic_salary: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax</Label>
                    <Input type="number" value={form.tax} onChange={e => setForm(f => ({ ...f, tax: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Bonus</Label>
                    <Input type="number" value={form.bonus} onChange={e => setForm(f => ({ ...f, bonus: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Deductions</Label>
                    <Input type="number" value={form.deductions} onChange={e => setForm(f => ({ ...f, deductions: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Hire Date</Label>
                    <Input type="date" value={form.hire_date} onChange={e => setForm(f => ({ ...f, hire_date: e.target.value }))} max="2025-01-31" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <select className="w-full rounded border px-2 py-2" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                      <option value="Processed">Processed</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                  <Button type="submit">Add</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
                <p className="text-2xl font-bold">{payroll.length}</p>
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
                />
              </div>
              <FilterDialog
                branches={branches}
                filter={filter}
                setFilter={setFilter}
              />
            </div>
            <Button variant="outline" onClick={handleExportPayroll} disabled={!token}>
              <Download className="h-4 w-4 mr-2" />
              Export Payroll
            </Button>
            <Button variant="outline" onClick={handleExportEmployees} disabled={!token}>
              <Download className="h-4 w-4 mr-2" />
              Export Employees
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Payroll - January 2025</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Base Salary</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Pay</TableHead>
                <TableHead>Pay Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.branch}</TableCell>
                  <TableCell>${employee.baseSalary.toLocaleString()}</TableCell>
                  <TableCell>${employee.tax.toLocaleString()}</TableCell>
                  <TableCell>${employee.bonus.toLocaleString()}</TableCell>
                  <TableCell>${employee.deductions.toLocaleString()}</TableCell>
                  <TableCell className="font-bold">${employee.netPay.toLocaleString()}</TableCell>
                  <TableCell>{employee.payDate}</TableCell>
                  <TableCell>{getStatusBadge(employee.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEdit(employee.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Payslip
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(employee.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(employee.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download Payslip
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}