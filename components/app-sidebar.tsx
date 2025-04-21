"use client";

import {
  Home,
  MessageSquare,
  Users,
  FileText,
  BarChart2,
  Settings,
  Plus,
  Search,
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import ContactForm from "./ui/contactForm";
import { useState } from "react";
import usePostData from "@/hooks/api/usePostData";

// Menu items
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

export function AppSidebar() {
  // const { state } = useSidebar()
  const pathname = usePathname(); // Get current route
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const mutation = usePostData("https://bizwapp-back-end-khaki.vercel.app/api/auth/addContact");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("New Contact:", newContact);
    const contactArray = [newContact];
    mutation.mutate(contactArray, {
      onSuccess: (data) => {
        console.log(data);
        alert(data["message"]);
      },
      onError: (data) => {
        alert(data["message"]);
      },
    });
    setIsDialogOpen(false);
    // You can add additional logic to save contact here
  };

  const addContactClick = () => {};

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="flex flex-col gap-4  ">
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
          <span className="text-lg font-semibold">WhatsApp Business</span>
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
                    >
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge && (
                      <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground">
                        {item.badge}
                      </Badge>
                    )}
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
              <Button className="justify-start gap-2" variant="outline">
                <Plus className="h-4 w-4" />
                <span>New Chat</span>
              </Button>
              <Button className="justify-start gap-2" variant="outline">
                <Plus className="h-4 w-4" />
                <span>New Template</span>
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="justify-start gap-2" variant="outline">
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
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-2">
          <Button variant="ghost" className="justify-start gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </Button>
          <Button variant="ghost" className="justify-start gap-2">
            <HelpCircle className="h-4 w-4" />
            <span>Help & Support</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
