"use client"

import {
  Archive,
  Download,
  Upload,
  FileText,
  Database,
  Shield,
  Bell,
  HelpCircle,
  Trash2,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Others() {
  const quickActions = [
    {
      title: "Backup Data",
      description: "Create a complete backup of your inventory data",
      icon: Archive,
      action: "Create Backup",
      variant: "default" as const,
      status: "Ready",
    },
    {
      title: "Import Products",
      description: "Import products from CSV or Excel files",
      icon: Upload,
      action: "Import Data",
      variant: "outline" as const,
      status: "Available",
    },
    {
      title: "Export Reports",
      description: "Export comprehensive inventory and sales reports",
      icon: Download,
      action: "Export All",
      variant: "outline" as const,
      status: "Available",
    },
    {
      title: "System Logs",
      description: "View system activity and error logs",
      icon: FileText,
      action: "View Logs",
      variant: "outline" as const,
      status: "12 New",
    },
  ]

  const systemTools = [
    {
      title: "Database Management",
      description: "Optimize and maintain database performance",
      icon: Database,
      status: "Healthy",
      lastRun: "2 hours ago",
    },
    {
      title: "Security Center",
      description: "Manage security settings and access controls",
      icon: Shield,
      status: "Secure",
      lastRun: "1 day ago",
    },
    {
      title: "Notification Center",
      description: "Configure alerts and notification preferences",
      icon: Bell,
      status: "15 Active",
      lastRun: "Just now",
    },
    {
      title: "Data Cleanup",
      description: "Clean up old records and optimize storage",
      icon: Trash2,
      status: "Pending",
      lastRun: "1 week ago",
    },
  ]

  const maintenanceTools = [
    {
      title: "Clear Cache",
      description: "Clear system cache to improve performance",
      action: "Clear Now",
    },
    {
      title: "Rebuild Index",
      description: "Rebuild database indexes for better performance",
      action: "Rebuild",
    },
    {
      title: "Update System",
      description: "Check for and install system updates",
      action: "Check Updates",
    },
    {
      title: "Reset Settings",
      description: "Reset all settings to default values",
      action: "Reset",
      danger: true,
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Tools & Utilities</h1>
          <p className="text-gray-600">Additional tools and maintenance options for your inventory system</p>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <div
                key={action.title}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <action.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{action.status}</Badge>
                  <Button variant={action.variant} size="sm">
                    {action.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Management */}
      <Card>
        <CardHeader>
          <CardTitle>System Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemTools.map((tool) => (
              <div
                key={tool.title}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <tool.icon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{tool.title}</h3>
                    <p className="text-sm text-gray-500">{tool.description}</p>
                    <p className="text-xs text-gray-400">Last run: {tool.lastRun}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{tool.status}</Badge>
                  <Button variant="ghost" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Maintenance & Support */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {maintenanceTools.map((tool) => (
              <div key={tool.title} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-sm">{tool.title}</h4>
                    <p className="text-xs text-gray-500">{tool.description}</p>
                  </div>
                </div>
                <Button variant={tool.danger ? "destructive" : "outline"} size="sm" className="w-full">
                  {tool.action}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Help & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              📚 Documentation
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              🎥 Video Tutorials
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              💬 Contact Support
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              🐛 Report Issue
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              💡 Feature Request
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Version:</span>
              <span className="font-medium">v2.1.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Database:</span>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Storage Used:</span>
              <span className="font-medium">78%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Backup:</span>
              <span className="font-medium">2 hours ago</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Uptime:</span>
              <span className="font-medium">15 days</span>
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              System Health Check
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
