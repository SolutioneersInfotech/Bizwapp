"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Download,
  Upload,
  Tag,
  MessageSquare,
  Trash,
  Edit,
  FileUp,
} from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import * as XLSX from "xlsx"

export default function ContactsPage() {
  const { toast } = useToast()
  const [contacts, setContacts] = useState([
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
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filteredContacts, setFilteredContacts] = useState(contacts)

  // Import dialog state
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importedContacts, setImportedContacts] = useState([])
  const fileInputRef = useRef(null)

  // Add contact dialog state
  const [addContactDialogOpen, setAddContactDialogOpen] = useState(false)
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
  })

  // Filter contacts based on search query and active tab
  const filterContacts = () => {
    let result = [...contacts]

    // Filter by tab
    if (activeTab === "active") {
      result = result.filter((contact) => contact.status === "Active")
    } else if (activeTab === "blocked") {
      result = result.filter((contact) => contact.status === "Blocked")
    } else if (activeTab === "groups") {
      // In a real app, you would filter by groups
      result = result.filter((contact) => contact.tags.includes("Group"))
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (contact) =>
          contact.name.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query) ||
          contact.phone.includes(query),
      )
    }

    setFilteredContacts(result)
  }

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value)
    filterContacts()
  }

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    filterContacts()
  }

  // Handle file upload for import
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result)
        const workbook = XLSX.read(data, { type: "array" })

        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[worksheetName]

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        // Format the data
        const formattedContacts = jsonData.map((row, index) => {
          const name = row.name || row.Name || row.NAME || `Contact ${index + 1}`
          const phone =
            row.phone || row.Phone || row.PHONE || row.phoneNumber || row.PhoneNumber || row.mobile || row.Mobile || ""
          const email = row.email || row.Email || row.EMAIL || ""

          // Generate initials from name
          const initials = name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)

          return {
            id: Date.now() + index,
            name,
            initials,
            email,
            phone,
            avatar: "/placeholder.svg?height=32&width=32",
            tags: ["Imported"],
            lastContact: "Never",
            status: "Active",
          }
        })

        setImportedContacts(formattedContacts)

        toast({
          title: "File Imported",
          description: `Successfully imported ${formattedContacts.length} contacts.`,
        })
      } catch (error) {
        console.error("Error parsing file:", error)
        toast({
          title: "Import Failed",
          description: "There was an error parsing the file. Please check the format and try again.",
          variant: "destructive",
        })
      }
    }

    reader.readAsArrayBuffer(file)
  }

  // Handle import confirmation
  const handleImportConfirm = () => {
    if (importedContacts.length === 0) {
      toast({
        title: "No Contacts to Import",
        description: "Please upload a file with contacts first.",
        variant: "destructive",
      })
      return
    }

    // Add imported contacts to the contacts list
    setContacts((prevContacts) => [...prevContacts, ...importedContacts])

    // Reset imported contacts
    setImportedContacts([])

    // Close dialog
    setImportDialogOpen(false)

    toast({
      title: "Contacts Imported",
      description: `${importedContacts.length} contacts have been added to your list.`,
    })
  }

  // Handle export
  const handleExport = () => {
    // Create a worksheet from the contacts data
    const worksheet = XLSX.utils.json_to_sheet(
      contacts.map((contact) => ({
        Name: contact.name,
        Phone: contact.phone,
        Email: contact.email,
        Status: contact.status,
        Tags: contact.tags.join(", "),
        "Last Contact": contact.lastContact,
      })),
    )

    // Create a workbook with the worksheet
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts")

    // Generate the file and trigger download
    XLSX.writeFile(workbook, "contacts_export.xlsx")

    toast({
      title: "Contacts Exported",
      description: `${contacts.length} contacts have been exported to Excel.`,
    })
  }

  // Handle add contact form change
  const handleAddContactChange = (e) => {
    const { name, value } = e.target
    setNewContact((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle add contact submission
  const handleAddContactSubmit = (e) => {
    e.preventDefault()

    // Validate required fields
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Validation Error",
        description: "Name and Contact Number are required fields.",
        variant: "destructive",
      })
      return
    }

    // Generate initials from name
    const initials = newContact.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)

    // Create new contact object
    const contact = {
      id: Date.now(),
      name: newContact.name,
      initials,
      email: newContact.email || "",
      avatar: "/placeholder.svg?height=32&width=32",
      phone: newContact.phone,
      tags: ["New"],
      lastContact: "Never",
      status: "Active",
    }

    // Add to contacts list
    setContacts((prev) => [...prev, contact])

    // Reset form
    setNewContact({
      name: "",
      phone: "",
      email: "",
    })

    // Close dialog
    setAddContactDialogOpen(false)

    toast({
      title: "Contact Added",
      description: `${contact.name} has been added to your contacts.`,
    })
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Download className="h-3.5 w-3.5" />
                  <span>Export</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Contacts</DialogTitle>
                  <DialogDescription>Export your contacts to a CSV or Excel file.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    You are about to export {contacts.length} contacts. Choose your preferred format:
                  </p>
                  <div className="flex gap-4">
                    <Button onClick={handleExport} className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Export to Excel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Import</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Import Contacts</DialogTitle>
                  <DialogDescription>Upload a CSV or Excel file to import contacts.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 mb-4">
                    <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Click the button below to select a CSV or Excel file
                    </p>
                    <input
                      type="file"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                    <Button onClick={() => fileInputRef.current.click()}>Click here to import CSV/XLSX file</Button>
                  </div>

                  {importedContacts.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Preview ({importedContacts.length} contacts)</h3>
                      <div className="border rounded-lg max-h-[200px] overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Phone</TableHead>
                              <TableHead>Email</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {importedContacts.slice(0, 5).map((contact) => (
                              <TableRow key={contact.id}>
                                <TableCell>{contact.name}</TableCell>
                                <TableCell>{contact.phone}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                              </TableRow>
                            ))}
                            {importedContacts.length > 5 && (
                              <TableRow>
                                <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                                  And {importedContacts.length - 5} more contacts...
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleImportConfirm} disabled={importedContacts.length === 0}>
                    Import {importedContacts.length} Contacts
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={addContactDialogOpen} onOpenChange={setAddContactDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Contact</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Contact</DialogTitle>
                  <DialogDescription>Enter the details of the new contact.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddContactSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter contact name"
                        value={newContact.name}
                        onChange={handleAddContactChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">
                        Contact Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Enter phone number with country code"
                        value={newContact.phone}
                        onChange={handleAddContactChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground">Include country code, e.g., +1 (555) 123-4567</p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter email address (optional)"
                        value={newContact.email}
                        onChange={handleAddContactChange}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setAddContactDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Contact</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contacts..."
              className="w-full bg-background pl-8 pr-4"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Contacts</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="blocked">Blocked</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
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
                    {filteredContacts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No contacts found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContacts.map((contact) => (
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
                      ))
                    )}
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

