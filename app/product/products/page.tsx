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
import { Plus, Package, XCircle, AlertTriangle, DollarSign, TrendingUp, Search, Filter, Edit, Trash2, Eye, ShoppingCart, Tag, Calendar, Download, X } from "lucide-react"
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
    <div className="flex-1 md:w-[64.5rem] space-y-4 p-2 md:p-3 md:pr-6 pt-4 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Product Management</h1>
          <p className="text-sm text-gray-600">Manage your product and stock levels</p>
        </div>
        <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Add a new product to your inventory with all necessary details.
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddProduct(false)}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-4">
              {/* Name and Category - Stack on mobile, side by side on tablet+ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Description - Full width on all screens */}
              <div className="space-y-2">
                <Label htmlFor="productDescription">Description</Label>
                <Textarea
                  id="productDescription"
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors min-h-[80px]"
                />
              </div>

              {/* Price, Cost, Stock - Stack on mobile, 2 cols on tablet, 3 cols on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
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

              {/* SKU and Supplier - Stack on mobile, side by side on tablet+ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Image URL - Full width on all screens */}
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

              {/* Submit Button - Full width with responsive padding */}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 mt-6 py-2.5">
                Add Product
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className={`text-xs md:text-sm font-medium ${stat.textColor} truncate`}>{stat.title}</p>
                  <p className={`text-lg md:text-xl font-bold ${stat.textColor === 'text-gray-600' ? '' : stat.textColor} truncate`}>{stat.value}</p>
                </div>
                <div className={`h-8 w-8 md:h-10 md:w-10 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 ml-2`}>
                  <stat.icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 sm:justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:flex-1">
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
                <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
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
      <Card className="w-full overflow-hidden">
        <CardHeader className="p-4">
          <CardTitle className="text-lg">Product Inventory</CardTitle>
        </CardHeader>
        <CardContent className="p-0 w-full">
          {/* Mobile Card View */}
          <div className="block md:hidden space-y-3 p-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{product.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                        className="h-7 w-7 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="h-7 w-7 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="min-w-0">
                      <span className="text-gray-500 dark:text-gray-400 block text-xs">Category</span>
                      <span className="font-medium text-xs truncate block">{product.category}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-gray-500 dark:text-gray-400 block text-xs">SKU</span>
                      <span className="font-medium text-xs truncate block">{product.sku}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-gray-500 dark:text-gray-400 block text-xs">Price</span>
                      <span className="font-medium text-xs truncate block">FRW {product.price.toLocaleString()}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-gray-500 dark:text-gray-400 block text-xs">Stock</span>
                      <span className="font-medium text-xs">{product.stock}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-gray-500 dark:text-gray-400 block text-xs">Status</span>
                      <div className="mt-1">
                        {getStatusBadge(product.status)}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <span className="text-gray-500 dark:text-gray-400 block text-xs">Supplier</span>
                      <span className="font-medium text-xs truncate block">{product.supplier}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block w-full">
            <div className="overflow-x-auto w-full">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%] min-w-[200px]">Product</TableHead>
                    <TableHead className="hidden lg:table-cell w-[12%] min-w-[100px]">Category</TableHead>
                    <TableHead className="hidden xl:table-cell w-[10%] min-w-[80px]">SKU</TableHead>
                    <TableHead className="w-[15%] min-w-[100px]">Price</TableHead>
                    <TableHead className="w-[8%] min-w-[60px]">Stock</TableHead>
                    <TableHead className="w-[10%] min-w-[80px]">Status</TableHead>
                    <TableHead className="hidden lg:table-cell w-[15%] min-w-[120px]">Supplier</TableHead>
                    <TableHead className="w-[10%] min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="w-[35%] min-w-[200px]">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{product.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{product.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm w-[12%] min-w-[100px]">
                        <span className="truncate block">{product.category}</span>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-sm w-[10%] min-w-[80px]">
                        <span className="truncate block">{product.sku}</span>
                      </TableCell>
                      <TableCell className="text-sm w-[15%] min-w-[100px]">
                        <span className="truncate block">FRW {product.price.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="text-sm w-[8%] min-w-[60px]">{product.stock}</TableCell>
                      <TableCell className="w-[10%] min-w-[80px]">{getStatusBadge(product.status)}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm w-[15%] min-w-[120px]">
                        <span className="truncate block">{product.supplier}</span>
                      </TableCell>
                      <TableCell className="w-[10%] min-w-[80px]">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(product)}
                            className="h-7 w-7 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="h-7 w-7 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
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