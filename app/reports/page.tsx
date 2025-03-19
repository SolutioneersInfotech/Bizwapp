"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Download,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Users,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react"
import { useAnalytics } from "@/contexts/AnalyticsContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/date-range-picker"
import { useToast } from "@/hooks/use-toast"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export default function ReportsPage() {
  const { analytics, refreshAnalytics, isLoading } = useAnalytics()
  const { toast } = useToast()
  const [dateRange, setDateRange] = useState({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() })
  const [reportType, setReportType] = useState("messages")

  const handleRefreshData = () => {
    refreshAnalytics()
    toast({
      title: "Data Refreshed",
      description: "Report data has been updated",
    })
  }

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your report is being prepared for download",
    })

    // In a real app, this would trigger a download
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your report has been downloaded",
      })
    }, 1500)
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleExportData}>
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </Button>
            <Button size="sm" className="h-8 gap-1" onClick={handleRefreshData} disabled={isLoading}>
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <Tabs defaultValue="overview" className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="messages">Message Activity</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="contacts">Contact Growth</SelectItem>
                <SelectItem value="templates">Template Usage</SelectItem>
              </SelectContent>
            </Select>

            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalSent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +12.5% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,429</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +8.2% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.deliveryRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +2.3% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Read Rate</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.readRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500 flex items-center">
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                  -1.2% from last month
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 overflow-hidden rounded-xl border bg-card text-card-foreground shadow">
            <CardHeader>
              <CardTitle>Message Activity</CardTitle>
              <CardDescription>Message delivery and response rates over time</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analytics.dailyStats}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="sent"
                      stackId="1"
                      stroke="#8884d8"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="delivered"
                      stackId="2"
                      stroke="#82ca9d"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                    />
                    <Area type="monotone" dataKey="read" stackId="3" stroke="#ffc658" fill="hsl(var(--primary))" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3 overflow-hidden rounded-xl border bg-card text-card-foreground shadow">
            <CardHeader>
              <CardTitle>Message Types</CardTitle>
              <CardDescription>Distribution of message types sent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={messageTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {messageTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow">
            <CardHeader>
              <CardTitle>Response Time</CardTitle>
              <CardDescription>Average time to respond to customer messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={responseTimeData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="time" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow">
            <CardHeader>
              <CardTitle>Template Performance</CardTitle>
              <CardDescription>Response rates for different message templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={templatePerformanceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sent" stroke="#8884d8" />
                    <Line type="monotone" dataKey="responses" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Mock data for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const messageTypeData = [
  { name: "Text", value: 65 },
  { name: "Template", value: 25 },
  { name: "Image", value: 7 },
  { name: "Document", value: 3 },
]

const responseTimeData = [
  { name: "Mon", time: 15 },
  { name: "Tue", time: 12 },
  { name: "Wed", time: 18 },
  { name: "Thu", time: 10 },
  { name: "Fri", time: 8 },
  { name: "Sat", time: 25 },
  { name: "Sun", time: 30 },
]

const templatePerformanceData = [
  { name: "Welcome", sent: 400, responses: 240 },
  { name: "Order Confirm", sent: 300, responses: 280 },
  { name: "Support", sent: 200, responses: 180 },
  { name: "Feedback", sent: 278, responses: 90 },
  { name: "Promo", sent: 189, responses: 40 },
]

