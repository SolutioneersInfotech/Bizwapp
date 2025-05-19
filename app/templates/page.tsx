"use client"

import { useState, useEffect } from "react"
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
import { useTemplates } from "@/contexts/TemplateContext"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import  CreateTemplateModal  from "../templates/create-template-modal"
import { useWhatsAppTemplates} from '../../hooks/api/getTemplate.js';
import { Spinner } from "../../components/ui/spinner";



export default function TemplatesPage() {
  const { templates, createTemplate, updateTemplate, deleteTemplate } = useTemplates()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  // const [filteredTemplates, setFilteredTemplates] = useState([])  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


  // New template dialog state
  const [newTemplateOpen, setNewTemplateOpen] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [templateCategory, setTemplateCategory] = useState("")
  const [templateContent, setTemplateContent] = useState("")

  // Edit template dialog state
  const [editTemplateOpen, setEditTemplateOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState(null)

  const { data: whatsappTemplates , isLoading } = useWhatsAppTemplates();
const [filteredTemplates, setFilteredTemplates] = useState([]);


useEffect(() => {
  if (whatsappTemplates) {
    setFilteredTemplates(whatsappTemplates.data); 
  }
}, [whatsappTemplates]);

useEffect(() => {
  if (!whatsappTemplates?.data) return;

  let results = [...whatsappTemplates.data]; 
  let result = results;

  if (activeTab !== "all") {
    console.log("Active Tab:", activeTab);
    result = result.filter((template) => template?.status?.toLowerCase() === activeTab);
    console.log("Filtered by Status:", result);
  }

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    console.log("Search Query:", query);
    result = result.filter(
      (template) =>
        template.components[0].text.toLowerCase().includes(query) 
      // ||
        // template.category.toLowerCase().includes(query) ||
        // template.content.toLowerCase().includes(query)
    );
    console.log("Filtered by Search:", result);
  }

  setFilteredTemplates(result);
}, [whatsappTemplates, activeTab, searchQuery]);

  const handleCreateTemplate = async () => {
  

    try {
      await createTemplate({
        name: templateName,
        category: templateCategory,
        content: templateContent,
        status: "Pending",
        updated: new Date().toISOString(),
        usageCount: 0,
      })

      

      // Reset form
      setTemplateName("")
      setTemplateCategory("")
      setTemplateContent("")
      setNewTemplateOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      })
    }
  }

  const handleEditTemplate = async () => {
    if (!editingTemplate) return

    

    try {
      await updateTemplate(editingTemplate.id, {
        name: templateName,
        category: templateCategory,
        content: templateContent,
        updated: new Date().toISOString(),
      })

      toast({
        title: "Template Updated",
        description: "Your template has been updated successfully",
      })

      // Reset form
      setEditTemplateOpen(false)
      setEditingTemplate(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive",
      })
    }
  }

  const handleDuplicateTemplate = async (template) => {
    try {
      await createTemplate({
        name: `${template.name} (Copy)`,
        category: template.category,
        content: template.content,
        status: "Pending",
        updated: new Date().toISOString(),
        usageCount: 0,
      })

      toast({
        title: "Template Duplicated",
        description: "Your template has been duplicated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate template",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return

    try {
      await deleteTemplate(templateToDelete.id)

      toast({
        title: "Template Deleted",
        description: "Your template has been deleted successfully",
      })

      setDeleteDialogOpen(false)
      setTemplateToDelete(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (template) => {
    setEditingTemplate(template)
    setTemplateName(template.name)
    setTemplateCategory(template.category)
    setTemplateContent(template.content)
    setEditTemplateOpen(true)
  }

  const openDeleteDialog = (template) => {
    setTemplateToDelete(template)
    setDeleteDialogOpen(true)
  }

  console.log("isLoading", isLoading)

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-3 pt-3 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight ml-8 md:m-0">Templates</h2>
          
              <Button className="gap-1" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4" />
                <span>New Template</span>
              </Button>
            
              <CreateTemplateModal
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
              onSubmit={handleCreateTemplate}
            />
          
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search templates..."
              className="w-full bg-background pl-8 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4 mb-4 md:mb-0">
          <TabsList className="grid grid-cols-2 gap-2 sm:flex sm:space-x-2 ">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Spinner size={40} className="text-green-600" />
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No templates found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery ? "Try adjusting your search or filters" : "Create your first template to get started"}
                </p>
                <Button className="mt-4" onClick={() => setNewTemplateOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <Badge
                          className={
                            template.status === "APPROVED"
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
                            <DropdownMenuItem onClick={() => openEditDialog(template)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                              <Copy className="mr-2 h-4 w-4" />
                              <span>Duplicate</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => openDeleteDialog(template)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle className="mt-2">{template.components[0].text}</CardTitle>
                      <CardDescription>{template.components[1].text}</CardDescription>
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
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Template Dialog */}
      <Dialog open={editTemplateOpen} onOpenChange={setEditTemplateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>Make changes to your message template</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Template Name</Label>
              <Input id="edit-name" value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={templateCategory} onValueChange={setTemplateCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Onboarding">Onboarding</SelectItem>
                  <SelectItem value="Transactional">Transactional</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Customer Support">Customer Support</SelectItem>
                  <SelectItem value="Engagement">Engagement</SelectItem>
                  <SelectItem value="Scheduling">Scheduling</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Template Content</Label>
              <Textarea
                id="edit-content"
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTemplateOpen(false)}>
              Cancel
            </Button>
            <Button disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {templateToDelete && (
              <div className="rounded-md border p-3 text-sm">
                <p className="font-medium">{templateToDelete.name}</p>
                <p className="text-muted-foreground mt-1">{templateToDelete.content}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTemplate} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

