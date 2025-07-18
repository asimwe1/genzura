"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Settings, DollarSign, Clock, Users } from "lucide-react"
import { toast } from "sonner"

interface Service {
  id: string
  name: string
  description: string
  category: string
  price: string
  duration: string
  status: "active" | "inactive"
  teamSize: number
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "IT Consulting",
      description: "Comprehensive IT consulting services for businesses",
      category: "Consulting",
      price: "$150/hour",
      duration: "Flexible",
      status: "active",
      teamSize: 3
    },
    {
      id: "2",
      name: "Technical Support",
      description: "24/7 technical support and troubleshooting",
      category: "Support",
      price: "$75/hour",
      duration: "24/7",
      status: "active",
      teamSize: 5
    },
    {
      id: "3",
      name: "Training Session",
      description: "Employee training and skill development",
      category: "Training",
      price: "$200/session",
      duration: "4 hours",
      status: "inactive",
      teamSize: 2
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    duration: "",
    status: "active",
    teamSize: 1
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description) {
      toast.error("Please fill in all required fields")
      return
    }

    const newService: Service = {
      id: editingService ? editingService.id : Date.now().toString(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: formData.price,
      duration: formData.duration,
      status: formData.status as "active" | "inactive",
      teamSize: formData.teamSize
    }

    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? newService : s))
      toast.success("Service updated successfully!")
      console.log("Updated service:", newService)
    } else {
      setServices([...services, newService])
      toast.success("Service added successfully!")
      console.log("Added service:", newService)
    }

    // Reset form
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      duration: "",
      status: "active",
      teamSize: 1
    })
    setShowForm(false)
    setEditingService(null)
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
      duration: service.duration,
      status: service.status,
      teamSize: service.teamSize
    })
    setShowForm(true)
  }

  return (
    <div className="flex-1 space-y-3 py-2 pr-4 md:pr-8 lg:pr-12 xl:pr-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Service Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your service offerings and operations</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <Badge variant={service.status === "active" ? "default" : "secondary"}>
                      {service.status}
                    </Badge>
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{service.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-green-600">{service.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{service.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Team Size:</span>
                    <span className="font-medium">{service.teamSize} people</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => handleEdit(service)}
                  >
                    Edit Service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Form Sidebar */}
        {showForm && (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{editingService ? "Edit Service" : "Add New Service"}</CardTitle>
              <CardDescription>
                {editingService ? "Update service information" : "Add a new service to your portfolio"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter service name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the service"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consulting">Consulting</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Training">Training</SelectItem>
                      <SelectItem value="Implementation">Implementation</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., $150/hour"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 4 hours"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    min="1"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) })}
                    placeholder="Number of team members"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingService ? "Update Service" : "Add Service"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingService(null)
                      setFormData({
                        name: "",
                        description: "",
                        category: "",
                        price: "",
                        duration: "",
                        status: "active",
                        teamSize: 1
                      })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        {!showForm && (
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{services.length}</p>
                    <p className="text-sm text-gray-600">Total Services</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {services.filter(s => s.status === "active").length}
                    </p>
                    <p className="text-sm text-gray-600">Active Services</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {services.reduce((acc, s) => acc + s.teamSize, 0)}
                    </p>
                    <p className="text-sm text-gray-600">Total Team Members</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 