import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Plus, MoreHorizontal, Copy, Edit, Trash, CheckCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function TemplatesPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Message Templates</h2>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            <span>New Template</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search templates..." className="w-full bg-background pl-8 pr-4" />
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <Card key={template.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        className={
                          template.status === "Approved"
                            ? "bg-green-500 hover:bg-green-600"
                            : template.status === "Pending"
                              ? "bg-amber-500 hover:bg-amber-600"
                              : "bg-red-500 hover:bg-red-600"
                        }
                      >
                        {template.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Duplicate</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="mt-2">{template.name}</CardTitle>
                    <CardDescription>{template.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="mb-4 rounded-md border p-3 text-sm">{template.content}</div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Updated {template.updated}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Used {template.usageCount} times</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

const templates = [
  {
    id: 1,
    name: "Welcome Message",
    category: "Onboarding",
    content: "Hello {{1}}, thank you for contacting us! How can we assist you today?",
    status: "Approved",
    updated: "2 days ago",
    usageCount: 245,
  },
  {
    id: 2,
    name: "Order Confirmation",
    category: "Transactional",
    content:
      "Your order #{{1}} has been confirmed and is being processed. Expected delivery: {{2}}. Thank you for shopping with us!",
    status: "Approved",
    updated: "1 week ago",
    usageCount: 189,
  },
  {
    id: 3,
    name: "Support Follow-up",
    category: "Customer Support",
    content:
      "Hi {{1}}, we wanted to follow up on your recent support request. Has your issue been resolved to your satisfaction?",
    status: "Pending",
    updated: "3 days ago",
    usageCount: 56,
  },
  {
    id: 4,
    name: "Appointment Reminder",
    category: "Scheduling",
    content:
      "Reminder: You have an appointment scheduled for {{1}} at {{2}}. Please reply YES to confirm or NO to reschedule.",
    status: "Approved",
    updated: "5 days ago",
    usageCount: 132,
  },
  {
    id: 5,
    name: "Feedback Request",
    category: "Engagement",
    content: "We value your opinion! Please rate your recent experience with us from 1-5, with 5 being excellent.",
    status: "Rejected",
    updated: "1 day ago",
    usageCount: 0,
  },
  {
    id: 6,
    name: "Product Restock",
    category: "Marketing",
    content: "Good news! The {{1}} you were interested in is back in stock. Shop now before it sells out again!",
    status: "Pending",
    updated: "4 days ago",
    usageCount: 0,
  },
]

