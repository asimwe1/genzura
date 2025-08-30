"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Package, Building2, MapPin, Phone, Mail, UserPlus, PackagePlus, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Branch {
  id: number
  organization_id: number
  name: string
  location: string
  manager_id: number | null
  phone: string | null
  email: string | null
}

export default function BranchesPage() {
  const [showAddDepartment, setShowAddDepartment] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showAddTeam, setShowAddTeam] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [branchEmployees, setBranchEmployees] = useState<{[key: number]: any[]}>({});
  const [employeesLoading, setEmployeesLoading] = useState<{[key: number]: boolean}>({});
  const [allEmployees, setAllEmployees] = useState<any[]>([]);

  // Fetch branches from API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.warn("No token found in localStorage")
          setLoading(false)
          return
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://genzura.aphezis.com"
        const branchesUrl = baseUrl.replace(/\/+$/, "") + "/branches"
        
        console.log("Fetching branches from:", branchesUrl)
        
        const response = await fetch(branchesUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch branches: ${response.status}`)
        }

        const data = await response.json()
        console.log("Branches API response:", data)
        
        if (data.ret === 1 && Array.isArray(data.data)) {
          setBranches(data.data)
        } else {
          console.warn("Invalid branches data structure:", data)
          setBranches([])
        }
      } catch (error) {
        console.error("Error fetching branches:", error)
        toast.error("Failed to load branches")
        setBranches([])
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [])

  const [departmentForm, setDepartmentForm] = useState({
    name: "",
    location: "",
    manager: "",
    phone: "",
    email: "",
    description: ""
  })

  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    supplier: "",
    departmentId: ""
  })

  const [teamForm, setTeamForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    basicSalary: "",
    hireDate: "",
    departmentId: ""
  })

  // Mock data for products and team (since API doesn't provide these yet)
  const mockProducts = [
    { id: 1, name: "Supreme Cherry Coffee", category: "Raw Coffee", quantity: "1000kg", price: "5000 FRW", supplier: "Local Farmers" },
    { id: 2, name: "Parchment Coffee", category: "Processed Coffee", quantity: "500kg", price: "3000 FRW", supplier: "Local Farmers" }
  ]

  const mockTeam = [
    { id: 1, firstName: "Alice", lastName: "Johnson", jobTitle: "Field Supervisor", email: "alice@coffee.com", phone: "+250 788 234 567" },
    { id: 2, firstName: "Bob", lastName: "Wilson", jobTitle: "Harvest Manager", email: "bob@coffee.com", phone: "+250 788 345 678" }
  ]

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Enhanced validation
    if (!departmentForm.name || departmentForm.name.trim() === "") {
      toast.error("Please fill in the branch name")
      return
    }

    // Validate email format if provided
    if (departmentForm.email && departmentForm.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(departmentForm.email.trim())) {
        toast.error("Please enter a valid email address")
        return
      }
    }

    // Validate phone format if provided
    if (departmentForm.phone && departmentForm.phone.trim() !== "") {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/
      if (!phoneRegex.test(departmentForm.phone.trim())) {
        toast.error("Please enter a valid phone number")
        return
      }
    }

    try {
      setSubmitting(true)
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Authentication token not found")
        setSubmitting(false)
        return
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://genzura.aphezis.com"
      const branchesUrl = baseUrl.replace(/\/+$/, "") + "/branches"
      
      // Validate manager_id if provided
      let managerId = null
      if (departmentForm.manager && departmentForm.manager.trim() !== "") {
        const parsedManagerId = parseInt(departmentForm.manager)
        if (isNaN(parsedManagerId)) {
          toast.error("Manager ID must be a valid number")
          setSubmitting(false)
          return
        }
        managerId = parsedManagerId
      }

      const branchData = {
        name: departmentForm.name.trim(),
        location: departmentForm.location.trim() || null,
        phone: departmentForm.phone.trim() || null,
        email: departmentForm.email.trim() || null,
        ...(managerId && { manager_id: managerId })
      }

      console.log("Creating branch with data:", branchData)
      
      const response = await fetch(branchesUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(branchData)
      })

      if (!response.ok) {
        let errorMessage = `Failed to create branch: ${response.status}`
        try {
          const errorData = await response.json()
          console.error("Server error response:", errorData)
          errorMessage = errorData.msg || errorData.message || errorData.error || errorMessage
        } catch (parseError) {
          console.error("Could not parse error response:", parseError)
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("Branch created successfully:", data)
      
      toast.success("Branch added successfully!")
      setShowAddDepartment(false)
      setDepartmentForm({ name: "", location: "", manager: "", phone: "", email: "", description: "" })
      
      // Refresh the branches list to show the new branch
      window.location.reload()
      
    } catch (error) {
      console.error("Error creating branch:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create branch")
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!productForm.name || !productForm.category) {
      toast.error("Please fill in the required fields")
      return
    }
    toast.success("Product added to branch successfully!")
    setShowAddProduct(false)
    setProductForm({ name: "", category: "", quantity: "", price: "", supplier: "", departmentId: "" })
  }

    const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamForm.firstName || !teamForm.lastName || !teamForm.email || !teamForm.phone || !teamForm.jobTitle || !teamForm.basicSalary || !teamForm.hireDate) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Authentication token not found")
        return
      }

      // Get the selected branch from the selectedDepartment state
      const selectedBranch = branches.find(branch => branch.id === selectedDepartment)
      if (!selectedBranch) {
        toast.error("Branch not found")
        return
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://genzura.aphezis.com"
      const employeesUrl = baseUrl.replace(/\/+$/, "") + "/employees"
      
      const employeeData = {
        first_name: teamForm.firstName,
        last_name: teamForm.lastName,
        email: teamForm.email,
        phone: teamForm.phone,
        job_title: teamForm.jobTitle,
        basic_salary: teamForm.basicSalary,
        hire_date: teamForm.hireDate,
        branch_id: selectedBranch.id
      }

      console.log("Creating employee for branch:", selectedBranch.name, "Branch ID:", selectedBranch.id)
      console.log("Employee data:", employeeData)
      
      const response = await fetch(employeesUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(employeeData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.msg || `Failed to create employee: ${response.status}`)
      }

      const data = await response.json()
      console.log("Employee created successfully:", data)
      
      toast.success(`Employee added successfully to ${selectedBranch.name}!`)
      setShowAddTeam(false)
      setTeamForm({ 
        firstName: "", 
        lastName: "", 
        email: "", 
        phone: "", 
        jobTitle: "", 
        basicSalary: "", 
        hireDate: "", 
        departmentId: "" 
      })
      
      // Optionally refresh the branches data to show the new employee
      // You could add a refresh function here if needed
      
    } catch (error) {
      console.error("Error creating employee:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create employee")
    }
  }

  const getBranchById = (id: number) => {
    return branches.find(branch => branch.id === id)
  }

  const fetchBranchEmployees = async (branchId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      setEmployeesLoading(prev => ({ ...prev, [branchId]: true }));
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://genzura.aphezis.com";
      const url = baseUrl.replace(/\/+$/, "") + `/employees?branch_id=${branchId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.ret === 1 && Array.isArray(data.data)) {
        setBranchEmployees(prev => ({ ...prev, [branchId]: data.data }));
      } else {
        setBranchEmployees(prev => ({ ...prev, [branchId]: [] }));
      }
    } catch (e) {
      setBranchEmployees(prev => ({ ...prev, [branchId]: [] }));
    } finally {
      setEmployeesLoading(prev => ({ ...prev, [branchId]: false }));
    }
  };

  useEffect(() => {
    if (branches.length > 0) {
      branches.forEach(branch => {
        fetchBranchEmployees(branch.id);
      });
    }
  }, [branches]);

  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://genzura.aphezis.com";
        const url = baseUrl.replace(/\/+$/, "") + "/employees";
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.ret === 1 && Array.isArray(data.data)) {
          setAllEmployees(data.data);
        } else {
          setAllEmployees([]);
        }
      } catch (e) {
        setAllEmployees([]);
      }
    };
    fetchAllEmployees();
  }, [branches]);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Branch Management</h1>
          <p className="text-gray-600">Manage branches, products, and team members</p>
        </div>
        <Dialog open={showAddDepartment} onOpenChange={setShowAddDepartment}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Branch</DialogTitle>
              <DialogDescription>
                Create a new branch with manager and location details.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddDepartment} className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="deptName">Branch Name *</Label>
                <Input
                  id="deptName"
                  value={departmentForm.name}
                  onChange={(e) => setDepartmentForm({...departmentForm, name: e.target.value})}
                  required
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="deptLocation">Location</Label>
                <Input
                  id="deptLocation"
                  value={departmentForm.location}
                  onChange={(e) => setDepartmentForm({...departmentForm, location: e.target.value})}
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="deptName">Branch Manager</Label>
                <Input
                  id="deptManager"
                  value={departmentForm.manager}
                  onChange={(e) => setDepartmentForm({...departmentForm, manager: e.target.value})}
                  placeholder="Manager ID (optional)"
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="deptPhone">Phone</Label>
                <Input
                  id="deptPhone"
                  value={departmentForm.phone}
                  onChange={(e) => setDepartmentForm({...departmentForm, phone: e.target.value})}
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="deptEmail">Email</Label>
                <Input
                  id="deptEmail"
                  type="email"
                  value={departmentForm.email}
                  onChange={(e) => setDepartmentForm({...departmentForm, email: e.target.value})}
                />
                </div>
                {/* <div className="space-y-2">
                <Label htmlFor="deptDescription">Description</Label>
                <Textarea
                  id="deptDescription"
                  value={departmentForm.description}
                  onChange={(e) => setDepartmentForm({...departmentForm, description: e.target.value})}
                />
              </div> */}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {submitting ? "Adding Branch..." : "Add Branch"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Branch Cards */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
                
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : branches.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <Card key={branch.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{branch.name}</CardTitle>
                  <Badge variant="secondary">{mockProducts.length} Products</Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{branch.location}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">
                      Manager: {branch.manager_id ? `ID: ${branch.manager_id}` : 'Not Assigned'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{branch.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{branch.email || 'Not provided'}</span>
                  </div>
                </div>
                
                {/* <p className="text-sm text-gray-600">
                  Branch ID: {branch.id} | Organization ID: {branch.organization_id}
                </p> */}
                
                <div className="flex space-x-2">
                  <Dialog open={showAddProduct && selectedDepartment === branch.id} onOpenChange={(open) => {
                    setShowAddProduct(open)
                    if (!open) setSelectedDepartment(null)
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedDepartment(branch.id)}
                      >
                        <PackagePlus className="h-4 w-4 mr-1" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Product to {branch.name}</DialogTitle>
                        <DialogDescription>
                          Add a new product to this branch.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddProduct} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="prodName">Product Name *</Label>
                          <Input
                            id="prodName"
                            value={productForm.name}
                            onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="prodCategory">Category *</Label>
                          <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Raw Coffee">Raw Coffee</SelectItem>
                              <SelectItem value="Processed Coffee">Processed Coffee</SelectItem>
                              <SelectItem value="Export Ready">Export Ready</SelectItem>
                              <SelectItem value="Retail">Retail</SelectItem>
                              <SelectItem value="Gift Items">Gift Items</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="prodQuantity">Quantity</Label>
                          <Input
                            id="prodQuantity"
                            value={productForm.quantity}
                            onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="prodPrice">Price</Label>
                          <Input
                            id="prodPrice"
                            value={productForm.price}
                            onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="prodSupplier">Supplier</Label>
                          <Input
                            id="prodSupplier"
                            value={productForm.supplier}
                            onChange={(e) => setProductForm({...productForm, supplier: e.target.value})}
                          />
                        </div>
                        <input type="hidden" value={branch.id} />
                        <Button type="submit" className="w-full">Add Product</Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showAddTeam && selectedDepartment === branch.id} onOpenChange={(open) => {
                    setShowAddTeam(open)
                    if (!open) setSelectedDepartment(null)
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedDepartment(branch.id)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Add Employee
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] mx-auto">
                      <DialogHeader className="text-center">
                        <DialogTitle>Add Employee to {branch.name}</DialogTitle>
                                               <DialogDescription>
                         Add a new employee to {branches.find(b => b.id === selectedDepartment)?.name || 'this branch'} with complete details.
                       </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddTeam} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              value={teamForm.firstName || ''}
                              onChange={(e) => setTeamForm({...teamForm, firstName: e.target.value})}
                              required
                              placeholder="Enter first name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                              id="lastName"
                              value={teamForm.lastName || ''}
                              onChange={(e) => setTeamForm({...teamForm, lastName: e.target.value})}
                              required
                              placeholder="Enter last name"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="teamEmail">Email *</Label>
                          <Input
                            id="teamEmail"
                            type="email"
                            value={teamForm.email}
                            onChange={(e) => setTeamForm({...teamForm, email: e.target.value})}
                            required
                            placeholder="Enter email address"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="teamPhone">Phone *</Label>
                          <Input
                            id="teamPhone"
                            value={teamForm.phone}
                            onChange={(e) => setTeamForm({...teamForm, phone: e.target.value})}
                            required
                            placeholder="Enter phone number"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="jobTitle">Job Title *</Label>
                          <Input
                            id="jobTitle"
                            value={teamForm.jobTitle || ''}
                            onChange={(e) => setTeamForm({...teamForm, jobTitle: e.target.value})}
                            required
                            placeholder="Enter job title"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="basicSalary">Basic Salary *</Label>
                            <Input
                              id="basicSalary"
                              type="number"
                              step="0.01"
                              value={teamForm.basicSalary || ''}
                              onChange={(e) => setTeamForm({...teamForm, basicSalary: e.target.value})}
                              required
                              placeholder="0.00"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="hireDate">Hire Date *</Label>
                            <Input
                              id="hireDate"
                              type="date"
                              value={teamForm.hireDate || ''}
                              onChange={(e) => setTeamForm({...teamForm, hireDate: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        
                        <input type="hidden" value={branch.id} />
                        <Button type="submit" className="w-full">Add Employee</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Products List */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    Products ({mockProducts.length})
                  </h4>
                  <div className="space-y-1">
                    {mockProducts.slice(0, 2).map((product: any) => (
                      <div key={product.id} className="text-sm text-gray-600 flex justify-between">
                        <span>{product.name}</span>
                        <span>{product.quantity}</span>
                      </div>
                    ))}
                    {mockProducts.length > 2 && (
                      <div className="text-xs text-blue-600">+{mockProducts.length - 2} more products</div>
                    )}
                  </div>
                </div>

                {/* Team List */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Employees ({(branchEmployees[branch.id] || []).filter(emp => emp.email).length})
                  </h4>
                  <div className="space-y-1">
                    {employeesLoading[branch.id] ? (
                      <div className="text-sm text-gray-400">Loading employees...</div>
                    ) : (branchEmployees[branch.id] || []).filter(emp => emp.job_title && emp.job_title.toLowerCase() === "manager").length > 0 ? (
                      <>
                        <div className="text-xs text-gray-500 mb-1">Managers:</div>
                        {(branchEmployees[branch.id] || [])
                          .filter(emp => emp.job_title && emp.job_title.toLowerCase() === "manager")
                          .slice(0, 2)
                          .map(manager => (
                            <div key={manager.id} className="text-sm text-gray-600 flex justify-between">
                              <span>{manager.first_name} {manager.last_name}</span>
                              <span className="text-xs">{manager.email}</span>
                            </div>
                        ))}
                        {(branchEmployees[branch.id] || []).filter(emp => emp.job_title && emp.job_title.toLowerCase() === "manager").length > 2 && (
                          <div className="text-xs text-blue-600">
                            +{(branchEmployees[branch.id] || []).filter(emp => emp.job_title && emp.job_title.toLowerCase() === "manager").length - 2} more managers
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-gray-400">No managers assigned</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
          <p className="text-gray-500">Get started by adding your first branch.</p>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Branches</p>
                <p className="text-2xl font-bold">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : branches.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : branches.length * mockProducts.length}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Team Members</p>
                <p className="text-2xl font-bold">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : allEmployees.length}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Managers</p>
                <p className="text-2xl font-bold">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : branches.filter(b => b.manager_id !== null).length}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 