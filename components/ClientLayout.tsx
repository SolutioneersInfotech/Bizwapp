"use client";

import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";
import { Menu, PanelLeft, Search } from "lucide-react";
import {
  Home,
  MessageSquare,
  Users,
  FileText,
  BarChart2,
  Settings,
  Plus,
  Bell,
  HelpCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import ContactForm from "./ui/contactForm";
import usePostData from "@/hooks/api/usePostData";
import { useEffect, useState } from "react";
import NewChatDialog from "./newChat";
import CreateTemplateModal from "@/app/templates/create-template-modal";
import {  useQueryClient  } from "@tanstack/react-query";

const mainMenuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/dashboard",
    isActive: true,
  },
  {
    title: "Conversations",
    icon: MessageSquare,
    url: "/conversations",
    badge: 12,
  },
  {
    title: "Contacts",
    icon: Users,
    url: "/contacts",
  },
  {
    title: "Templates",
    icon: FileText,
    url: "/templates",
  },
  {
    title: "Reports",
    icon: BarChart2,
    url: "/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/settings",
  },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSidebar = !["/", "/signup", "/login"].includes(pathname);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [newChatPhone, setNewChatPhone] = useState("");
  const [newChatMessage, setNewChatMessage] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const handleCreateTemplate = async () => {
    //   try {
    //     await createTemplate({
    //       name: templateName,
    //       category: templateCategory,
    //       content: templateContent,
    //       status: "Pending",
    //       updated: new Date().toISOString(),
    //       usageCount: 0,
    //     })
    //     // Reset form
    //     setTemplateName("")
    //     setTemplateCategory("")
    //     setTemplateContent("")
    //     setNewTemplateOpen(false)
    //   } catch (error) {
    //     toast({
    //       title: "Error",
    //       description: "Failed to create template",
    //       variant: "destructive",
    //     })
    //   }
  };

  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
  });

   const [userId , setUserId]= useState(null);
    
      useEffect(()=>{
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          const id = userData.id || userData.user?._id || null;
          setUserId(id);
        }
      },[]);

  const queryClient = useQueryClient();

  const handleStartNewChat = () => {
    setNewChatDialogOpen(false);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to close the sidebar
  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const mutation = usePostData(`https://api.bizwapp.com/api/auth/addContact/${userId}`);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const contactArray = [newContact]
    // const contactWithUserId = { ...newContact , userId}
    // const contactArray = [contactWithUserId];

    mutation.mutate(contactArray, {
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries({ queryKey: ['contacts'] });

      },
      onError: (data) => {
        alert(data["message"]);
      },
    });
    setIsDialogOpen(false);
    // You can add additional logic to save contact here
  };

  return (
    <div className="flex min-h-screen">
      {showSidebar ? (
        <div className="flex h-screen w-full">
          {/* Desktop Sidebar */}
          <div className="hidden md:flex w-[280px]">
            <AppSidebar />
          </div>

          {/* Mobile Sidebar Sheet */}
          <div className="md:hidden fixed top-1 left-1 z-50">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="!p-1 !h-8 !w-8 mt-3 mt-[12px]"
                  onClick={() => setIsSidebarOpen(true)}
                > 
                  <PanelLeft />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="h-full overflow-y-auto max-h-screen">
                <SidebarHeader className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-foreground"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <span className="text-lg font-semibold">
                      WhatsApp Business
                    </span>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="w-full bg-background pl-8 pr-4"
                    />
                  </div>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {mainMenuItems.map((item) => {
                          const isActive = pathname === item.url; // Check if the route is active

                          return (
                            <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                className={`flex items-center gap-2 rounded-md px-3 py-2 ${
                                  isActive
                                    ? "bg-gray-200 dark:bg-gray-700 text-green-600"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                                onClick={handleSidebarClose} // Close the sidebar when item is clicked
                              >
                                <Link
                                  href={item.url}
                                  className="flex items-center gap-2"
                                >
                                  <item.icon className="h-5 w-5" />
                                  <span>{item.title}</span>
                                </Link>
                              </SidebarMenuButton>
                              {/* {item.badge && (
                                <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground">
                                  {item.badge}
                                </Badge> */}
                              {/* )} */}
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                  <SidebarSeparator />
                  <SidebarGroup>
                    <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <div className="grid grid-cols-1 gap-2">
                        <Button
                          className="justify-start gap-2"
                          variant="outline"
                          onClick={() => {
                            setNewChatDialogOpen(true);
                            handleSidebarClose();
                          }}
                        >
                          <Plus className="h-4 w-4" />
                          <span>New Chat</span>
                        </Button>

                        <Button
                          className="justify-start gap-2"
                          variant="outline"
                          onClick={() => {
                            setIsCreateModalOpen(true);
                            handleSidebarClose();
                          }}
                        >
                          <Plus className="h-4 w-4" />
                          <span>New Template</span>
                        </Button>

                        <Dialog
                          open={isDialogOpen}
                          onOpenChange={setIsDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              className="justify-start gap-2"
                              variant="outline"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Add Contact</span>
                            </Button>
                          </DialogTrigger>

                          <ContactForm
                            title="Create Contact"
                            description="Fill in the details below."
                            contactData={newContact}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            onClose={() => setIsDialogOpen(false)}
                          />
                        </Dialog>
                      </div>
                    </SidebarGroupContent>
                    <SidebarFooter className="p-4">
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          className="justify-start gap-2"
                          onClick={handleSidebarClose}
                        >
                          <Bell className="h-4 w-4" />
                          <Link href={"/notifications"}>
                            <span>Notifications</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start gap-2"
                          onClick={handleSidebarClose}
                        >
                          <HelpCircle className="h-4 w-4" />
                          <Link href={"/help-support"}>
                            <span>Help & Support</span>
                          </Link>
                        </Button>
                      </div>
                    </SidebarFooter>
                  </SidebarGroup>
                </SidebarContent>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-auto">
            <NewChatDialog
              open={newChatDialogOpen}
              onOpenChange={setNewChatDialogOpen}
              phone={newChatPhone}
              onPhoneChange={setNewChatPhone}
              message={newChatMessage}
              onMessageChange={setNewChatMessage}
              onSubmit={handleStartNewChat}
            />

            <CreateTemplateModal
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
              onSubmit={handleCreateTemplate}
            />
            {children}
          </main>
        </div>
      ) : (
        <div className="flex-1 overflow-auto w-full">{children}</div>
      )}
    </div>
  );
}
