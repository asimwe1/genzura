"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Package, XCircle, AlertTriangle, DollarSign, TrendingUp, Search, Filter, Edit, Trash2, Eye, ShoppingCart, Tag, Calendar, Download } from "lucide-react"
import { toast } from "sonner"


export default function ProductsPage() {
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showEditProduct, setShowEditProduct] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  // Stats data for dynamic rendering
  const statsData = [
    {
      title: "Total Products",
      value: "1,234",
      icon: Package,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      textColor: "text-gray-600"
    },
    {
      title: "Low Stock",
      value: "23",
      icon: AlertTriangle,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-600"
    },
    {
      title: "Out of Stock",
      value: "5",
      icon: XCircle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      textColor: "text-red-600"
    },
    {
      title: "Total Value",
      value: "$45,678",
      icon: DollarSign,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      textColor: "text-gray-600"
    }
  ];

  const [categoryFilter, setCategoryFilter] = useState("all")

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    cost: "",
    sku: "",
    stock: "",
    supplier: "",
    image: ""
  })

  // Sample products data
  const [products] = useState([
    {
      id: 1,
      name: "Supreme Cherry Coffee",
      description: "Premium quality coffee beans from high altitude regions",
      category: "Coffee",
      price: 25000,
      cost: 18000,
      sku: "COF-001",
      stock: 150,
      supplier: "M. Byimana Coffee",
      image: "/placeholder.jpg",
      status: "In Stock"
    },
    {
      id: 2,
      name: "Parchment Coffee",
      description: "Semi-processed coffee beans ready for final processing",
      category: "Coffee",
      price: 18000,
      cost: 12000,
      sku: "COF-002",
      stock: 200,
      supplier: "M. Byimana Coffee",
      image: "/placeholder.jpg",
      status: "In Stock"
    },
    {
      id: 3,
      name: "Fully Washed Coffee",
      description: "Fully processed and washed coffee beans",
      category: "Coffee",
      price: 32000,
      cost: 22000,
      sku: "COF-003",
      stock: 100,
      supplier: "M. Byimana Coffee",
      image: "/placeholder.jpg",
      status: "Low Stock"
    },
    {
      id: 4,
      name: "Coffee Processing Equipment",
      description: "Industrial coffee processing machinery",
      category: "Equipment",
      price: 2500000,
      cost: 1800000,
      sku: "EQP-001",
      stock: 5,
      supplier: "Coffee Equipment Co.",
      image: "/placeholder.jpg",
      status: "In Stock"
    }
  ])

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast.error("Please fill in all required fields")
      return
    }
    toast.success("Product added successfully!")
    setShowAddProduct(false)
    setProductForm({
      name: "",
      description: "",
      category: "",
      price: "",
      cost: "",
      sku: "",
      stock: "",
      supplier: "",
      image: ""
    })
  }

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!productForm.name || !productForm.price) {
      toast.error("Please fill in all required fields")
      return
    }
    toast.success("Product updated successfully!")
    setShowEditProduct(false)
    setSelectedProduct(null)
    setProductForm({
      name: "",
      description: "",
      category: "",
      price: "",
      cost: "",
      sku: "",
      stock: "",
      supplier: "",
      image: ""
    })
  }

  const handleDeleteProduct = (productId: number) => {
    toast.success("Product deleted successfully!")
  }

  const openEditDialog = (product: any) => {
    setSelectedProduct(product)
    setProductForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      cost: product.cost.toString(),
      sku: product.sku,
      stock: product.stock.toString(),
      supplier: product.supplier,
      image: product.image
    })
    setShowEditProduct(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">In Stock</Badge>
      case "Low Stock":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Low Stock</Badge>
      case "Out of Stock":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Out of Stock</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">{status}</Badge>
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalProducts = products.length
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0)
  const lowStockProducts = products.filter(product => product.stock < 20).length

  return (
    <div className="flex-1 space-y-6 pr-6 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-gray-600">Manage your product and stock levels</p>
        </div>
        <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new product to your inventory with all necessary details.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    required
                    className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productCategory">Category *</Label>
                  <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Coffee">Coffee</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Supplies">Supplies</SelectItem>
                      <SelectItem value="Packaging">Packaging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="productDescription">Description</Label>
                <Textarea
                  id="productDescription"
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productPrice">Price (FRW) *</Label>
                  <Input
                    id="productPrice"
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    required
                    className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productCost">Cost (FRW)</Label>
                  <Input
                    id="productCost"
                    type="number"
                    value={productForm.cost}
                    onChange={(e) => setProductForm({...productForm, cost: e.target.value})}
                    className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productStock">Stock Quantity</Label>
                  <Input
                    id="productStock"
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productSku">SKU</Label>
                  <Input
                    id="productSku"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                    className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productSupplier">Supplier</Label>
                  <Input
                    id="productSupplier"
                    value={productForm.supplier}
                    onChange={(e) => setProductForm({...productForm, supplier: e.target.value})}
                    className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="productImage">Image URL</Label>
                <Input
                  id="productImage"
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                  className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                Add Product
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 w-[21.5rem] lg:w-full md:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${stat.textColor}`}>{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor === 'text-gray-600' ? '' : stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`h-12 w-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 sm:justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:flex-1">
              <div className="relative w-full sm:flex-1 sm:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Coffee">Coffee</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Supplies">Supplies</SelectItem>
                  <SelectItem value="Packaging">Packaging</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{product.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>FRW {product.price.toLocaleString()}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>{product.supplier}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                        className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={showEditProduct} onOpenChange={setShowEditProduct}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information and details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProduct} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editProductName">Product Name *</Label>
                <Input
                  id="editProductName"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  required
                  className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editProductCategory">Category *</Label>
                <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                  <SelectTrigger className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Coffee">Coffee</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Supplies">Supplies</SelectItem>
                    <SelectItem value="Packaging">Packaging</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editProductDescription">Description</Label>
              <Textarea
                id="editProductDescription"
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editProductPrice">Price (FRW) *</Label>
                <Input
                  id="editProductPrice"
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  required
                  className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editProductCost">Cost (FRW)</Label>
                <Input
                  id="editProductCost"
                  type="number"
                  value={productForm.cost}
                  onChange={(e) => setProductForm({...productForm, cost: e.target.value})}
                  className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editProductStock">Stock Quantity</Label>
                <Input
                  id="editProductStock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                  className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editProductSku">SKU</Label>
                <Input
                  id="editProductSku"
                  value={productForm.sku}
                  onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                  className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editProductSupplier">Supplier</Label>
                <Input
                  id="editProductSupplier"
                  value={productForm.supplier}
                  onChange={(e) => setProductForm({...productForm, supplier: e.target.value})}
                  className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editProductImage">Image URL</Label>
              <Input
                id="editProductImage"
                type="url"
                value={productForm.image}
                onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
              Update Product
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 