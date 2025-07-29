"use client"

import React, { useState } from "react"
import { Calendar, Download, Filter, TrendingUp, TrendingDown, BarChart3, Package, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export default function ProductReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")

  const revenueTrendData = [
    { date: "Jan", revenue: 12000 },
    { date: "Feb", revenue: 14500 },
    { date: "Mar", revenue: 16000 },
    { date: "Apr", revenue: 15500 },
    { date: "May", revenue: 18000 },
    { date: "Jun", revenue: 20000 },
    { date: "Jul", revenue: 22000 },
  ]

  const categoryPerformanceData = [
    { category: "Electronics", sales: 45678 },
    { category: "Furniture", sales: 23456 },
    { category: "Accessories", sales: 12345 },
  ]

  const reportData = [
    {
      category: "Electronics",
      totalSales: 45678,
      totalItems: 234,
      avgPrice: 195.23,
      trend: "up",
      change: 12.5,
    },
    {
      category: "Furniture",
      totalSales: 23456,
      totalItems: 89,
      avgPrice: 263.66,
      trend: "down",
      change: -5.2,
    },
    {
      category: "Accessories",
      totalSales: 12345,
      totalItems: 156,
      avgPrice: 79.13,
      trend: "up",
      change: 8.7,
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-3 md:pr-6 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your inventory performance and trends</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Period Selection */}
      <Card className="w-[23rem] md:w-full">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <label className="text-sm font-medium">Report Period:</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 w-[23rem] lg:w-full sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-xl sm:text-2xl font-bold">$81,479</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Items Sold</p>
                <p className="text-xl sm:text-2xl font-bold">479</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+8.2%</span>
                </div>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Order Value</p>
                <p className="text-xl sm:text-2xl font-bold">$170.12</p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  <span className="text-sm text-red-600">-2.1%</span>
                </div>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Category</p>
                <p className="text-xl sm:text-2xl font-bold">Electronics</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">56% of sales</span>
                </div>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="w-[23rem] md:w-full">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="h-48 sm:h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="w-[23rem] md:w-full">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Category Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="h-48 sm:h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryPerformanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report Table */}
      <Card className="w-[23rem] md:w-full">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Category Performance Report</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4 p-4">
            {reportData.map((item) => (
              <Card key={item.category} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BarChart3 className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.category}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.totalItems} items sold
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      {item.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <Badge
                        variant="outline"
                        className={item.change > 0 ? "text-green-600 border-green-200" : "text-red-600 border-red-200"}
                      >
                        {item.change > 0 ? "+" : ""}
                        {item.change}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block text-xs">Total Sales</span>
                      <span className="font-medium">${item.totalSales.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block text-xs">Avg Price</span>
                      <span className="font-medium">${item.avgPrice}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Category</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Items Sold</TableHead>
                  <TableHead>Avg Price</TableHead>
                  <TableHead className="w-[80px]">Trend</TableHead>
                  <TableHead className="w-[100px]">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((item) => (
                  <TableRow key={item.category}>
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell>${item.totalSales.toLocaleString()}</TableCell>
                    <TableCell>{item.totalItems}</TableCell>
                    <TableCell>${item.avgPrice}</TableCell>
                    <TableCell>
                      {item.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={item.change > 0 ? "text-green-600 border-green-200" : "text-red-600 border-red-200"}
                      >
                        {item.change > 0 ? "+" : ""}
                        {item.change}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}