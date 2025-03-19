import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Plus, MoreHorizontal, Download, Upload, Tag, MessageSquare, Trash, Edit } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ContactsPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Upload className="h-3.5 w-3.5" />
              <span>Import</span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Contact</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search contacts..." className="w-full bg-background pl-8 pr-4" />
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Contacts</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="blocked">Blocked</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Contact List</CardTitle>
                <CardDescription>Manage your contacts and customer information</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Last Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={contact.avatar} />
                              <AvatarFallback>{contact.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p>{contact.name}</p>
                              <p className="text-xs text-muted-foreground">{contact.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {contact.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{contact.lastContact}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              contact.status === "Active"
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-amber-500 hover:bg-amber-600"
                            }
                          >
                            {contact.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
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
                                  <Tag className="mr-2 h-4 w-4" />
                                  <span>Manage Tags</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  <span>Send Message</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                  <Trash className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

const contacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    initials: "SJ",
    email: "sarah.j@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    phone: "+1 (555) 123-4567",
    tags: ["Customer", "Premium"],
    lastContact: "Today",
    status: "Active",
  },
  {
    id: 2,
    name: "Michael Chen",
    initials: "MC",
    email: "michael.c@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    phone: "+1 (555) 987-6543",
    tags: ["Customer", "Support"],
    lastContact: "Yesterday",
    status: "Active",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    initials: "ER",
    email: "emily.r@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    phone: "+1 (555) 234-5678",
    tags: ["Lead", "Retail"],
    lastContact: "3 days ago",
    status: "Inactive",
  },
  {
    id: 4,
    name: "David Kim",
    initials: "DK",
    email: "david.k@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    phone: "+1 (555) 876-5432",
    tags: ["Customer", "Enterprise"],
    lastContact: "1 week ago",
    status: "Active",
  },
  {
    id: 5,
    name: "Lisa Wang",
    initials: "LW",
    email: "lisa.w@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    phone: "+1 (555) 345-6789",
    tags: ["Lead", "E-commerce"],
    lastContact: "2 weeks ago",
    status: "Inactive",
  },
]

