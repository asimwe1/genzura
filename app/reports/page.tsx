"use client"

import { useState, useEffect, useMemo } from "react"
import { Calendar, Download, Filter, TrendingUp, TrendingDown, BarChart3, Package, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from "recharts"
import { saveAs } from "file-saver"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [chartsLoading, setChartsLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Simulate loading for charts
  useEffect(() => {
    setChartsLoading(true)
    const timer = setTimeout(() => setChartsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [selectedPeriod])

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

  // Example sales trend data
  const salesTrendData = [
    { date: "Jul 1", sales: 1200 },
    { date: "Jul 2", sales: 1500 },
    { date: "Jul 3", sales: 1700 },
    { date: "Jul 4", sales: 1400 },
    { date: "Jul 5", sales: 1800 },
    { date: "Jul 6", sales: 2000 },
    { date: "Jul 7", sales: 2200 },
  ]

  // Example category performance data
  const categoryPerformanceData = [
    { category: "Electronics", sales: 45678 },
    { category: "Furniture", sales: 23456 },
    { category: "Accessories", sales: 12345 },
  ]

  // Filtered data based on category
  const filteredReportData = useMemo(() => {
    if (categoryFilter === "all") return reportData
    return reportData.filter(item => item.category === categoryFilter)
  }, [reportData, categoryFilter])

  // Filtered chart data (for demo, just use all data)
  const filteredSalesTrendData = salesTrendData // In real use, filter by dateRange
  const filteredCategoryPerformanceData = useMemo(() => {
    if (categoryFilter === "all") return categoryPerformanceData
    return categoryPerformanceData.filter(item => item.category === categoryFilter)
  }, [categoryPerformanceData, categoryFilter])

  // CSV export utility
  function exportToCSV() {
    const headers = [
      "Category",
      "Total Sales",
      "Items Sold",
      "Avg Price",
      "Trend",
      "Change (%)"
    ]
    const rows = reportData.map(item => [
      item.category,
      item.totalSales,
      item.totalItems,
      item.avgPrice,
      item.trend,
      item.change
    ])
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, `report-${selectedPeriod}.csv`)
  }

  return (
    <TooltipProvider>
      <ErrorBoundary>
        <div className="flex-1 space-y-6 pr-6 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Reports & Analytics</h1>
              <p className="text-gray-600">Track your inventory performance and trends</p>
            </div>
            <div className="flex space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center px-4 py-2 border rounded-md bg-white text-gray-700">
                    <Calendar className="h-4 w-4 mr-2" />
                    July 2025
                  </div>
                </TooltipTrigger>
                <TooltipContent>Current period</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={exportToCSV} aria-label="Export report as CSV" tabIndex={0}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export report as CSV</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Period Selection */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium">Report Period:</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod} aria-label="Select report period">
                    <SelectTrigger className="w-40 focus:ring-2 focus:ring-blue-500">
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => setFiltersOpen(true)} aria-label="Open advanced filters" tabIndex={0}>
                      <Filter className="h-4 w-4 mr-2" />
                      Advanced Filters
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Open advanced filters</TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold">$81,479</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+12.5%</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Items Sold</p>
                    <p className="text-2xl font-bold">479</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+8.2%</span>
                    </div>
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
                    <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                    <p className="text-2xl font-bold">$170.12</p>
                    <div className="flex items-center mt-2">
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      <span className="text-sm text-red-600">-2.1%</span>
                    </div>
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
                    <p className="text-sm font-medium text-gray-600">Top Category</p>
                    <p className="text-2xl font-bold">Electronics</p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-600">56% of sales</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Filters Modal */}
          <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Advanced Filters</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40 focus:ring-2 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {reportData.map(item => (
                        <SelectItem key={item.category} value={item.category}>{item.category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setFiltersOpen(false)}>Apply Filters</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  {chartsLoading ? (
                    <Skeleton className="w-full h-48 rounded-lg" />
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={filteredSalesTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip />
                        <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  {chartsLoading ? (
                    <Skeleton className="w-full h-48 rounded-lg" />
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={filteredCategoryPerformanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Report Table */}
          <Card>
            <CardHeader>
              <CardTitle>Category Performance Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg">
                <Table className="min-w-[600px]">
                  <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900">
                    <TableRow>
                      <TableHead scope="col">Category</TableHead>
                      <TableHead scope="col">Total Sales</TableHead>
                      <TableHead scope="col">Items Sold</TableHead>
                      <TableHead scope="col">Avg Price</TableHead>
                      <TableHead scope="col">Trend</TableHead>
                      <TableHead scope="col">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReportData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-400 py-8">No data available for the selected filters.</TableCell>
                      </TableRow>
                    ) : (
                      filteredReportData.map((item) => (
                        <TableRow key={item.category}>
                          <TableCell className="font-medium">{item.category}</TableCell>
                          <TableCell>${item.totalSales.toLocaleString()}</TableCell>
                          <TableCell>{item.totalItems}</TableCell>
                          <TableCell>${item.avgPrice}</TableCell>
                          <TableCell>
                            {item.trend === "up" ? (
                              <TrendingUp className="h-4 w-4 text-green-600" aria-label="Upward trend" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" aria-label="Downward trend" />
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </ErrorBoundary>
    </TooltipProvider>
  )
}
