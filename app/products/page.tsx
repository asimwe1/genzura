"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  XCircle,
  DollarSign,
  Loader2,
  User,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", price: "", supplier: "", status: "In Stock" });
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const inventoryItems = [
    {
      id: "INV001",
      name: "Wireless Headphones",
      category: "Electronics",
      quantity: 45,
      minStock: 10,
      price: 99.99,
      supplier: "TechCorp",
      status: "In Stock",
    },
    {
      id: "INV002",
      name: "Office Chair",
      category: "Furniture",
      quantity: 8,
      minStock: 15,
      price: 249.99,
      supplier: "FurniMax",
      status: "Low Stock",
    },
    {
      id: "INV003",
      name: "Laptop Stand",
      category: "Accessories",
      quantity: 0,
      minStock: 5,
      price: 39.99,
      supplier: "AccessoryHub",
      status: "Out of Stock",
    },
    {
      id: "INV004",
      name: "Bluetooth Speaker",
      category: "Electronics",
      quantity: 23,
      minStock: 8,
      price: 79.99,
      supplier: "SoundTech",
      status: "In Stock",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>
      case "Low Stock":
        return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
      case "Out of Stock":
        return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = () => {
    setForm({ name: "", category: "", price: "", supplier: "", status: "In Stock" });
    setFormOpen(true);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setFormOpen(false);
      // Add new item to inventoryItems
      inventoryItems.push({
        id: `INV${inventoryItems.length + 1}`,
        name: form.name,
        category: form.category,
        quantity: 0, // Default quantity
        minStock: 0, // Default min stock
        price: parseFloat(form.price),
        supplier: form.supplier,
        status: form.status,
      });
      setSearchTerm(""); // Clear search after adding
    }, 1000);
  };

  return (
    <TooltipProvider>
      <ErrorBoundary>
        <div className="flex-1 space-y-6 pr-4 md:pr-8 lg:pr-12 xl:pr-16 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Inventory Management</h1>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddProduct} aria-label="Add new inventory item" tabIndex={0}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add new inventory item</TooltipContent>
            </Tooltip>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold">1,234</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Low Stock</p>
                    <p className="text-2xl font-bold text-yellow-600">23</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600">5</p>
                  </div>
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold">$45,678</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search inventory..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      aria-label="Search inventory"
                    />
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" aria-label="Filter inventory" tabIndex={0}>
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Filter inventory</TooltipContent>
                  </Tooltip>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" aria-label="Export inventory" tabIndex={0}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export inventory</TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg">
                  <Table className="min-w-[800px]">
                    <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900">
                      <TableRow>
                        <TableHead scope="col">Item ID</TableHead>
                        <TableHead scope="col">Name</TableHead>
                        <TableHead scope="col">Category</TableHead>
                        <TableHead scope="col">Quantity</TableHead>
                        <TableHead scope="col">Min Stock</TableHead>
                        <TableHead scope="col">Price</TableHead>
                        <TableHead scope="col">Supplier</TableHead>
                        <TableHead scope="col">Status</TableHead>
                        <TableHead scope="col">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.minStock}</TableCell>
                          <TableCell>${item.price}</TableCell>
                          <TableCell>{item.supplier}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" aria-label="Open actions menu" tabIndex={0}>Actions</Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" aria-label="View item" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" aria-label="Edit item" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" aria-label="Delete item" />
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
              )}
            </CardContent>
          </Card>
          {formOpen && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" role="dialog" aria-modal="true">
              <form onSubmit={handleSave} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-6 w-6 text-blue-600" />
                  <span className="font-bold text-lg">Add Product</span>
                </div>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input name="name" value={form.name} onChange={handleInput} placeholder="Product Name" className="pl-10" required autoFocus aria-label="Product Name" />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input name="category" value={form.category} onChange={handleInput} placeholder="Category" className="pl-10" required aria-label="Category" />
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input name="price" value={form.price} onChange={handleInput} placeholder="Price" type="number" min="0" className="pl-10" required aria-label="Price" />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input name="supplier" value={form.supplier} onChange={handleInput} placeholder="Supplier" className="pl-10" required aria-label="Supplier" />
                </div>
                <select name="status" value={form.status} onChange={handleInput} className="w-full border rounded px-3 py-2" aria-label="Status">
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setFormOpen(false)} aria-label="Cancel add product">Cancel</Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={saving} aria-label="Save product">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </TooltipProvider>
  )
}
