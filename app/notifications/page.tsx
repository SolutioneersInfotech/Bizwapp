"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Bell,
  MessageSquare,
  Settings,
  AlertCircle,
  Info,
  MoreHorizontal,
  Check,
  Trash2,
  Clock,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";

// Define notification types
type NotificationType = "message" | "system" | "alert" | "info";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  sender?: {
    name: string;
    avatar: string;
    initials: string;
  };
  actionUrl?: string;
}

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [notificationDetailsOpen, setNotificationDetailsOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  // Load mock notifications on mount
  useEffect(() => {
    setNotifications(mockNotifications);
    setFilteredNotifications(mockNotifications);
  }, []);

  // Filter notifications based on active tab and search query
  useEffect(() => {
    let filtered = [...notifications];

    // Filter by tab
    if (activeTab === "unread") {
      filtered = filtered.filter((notification) => !notification.read);
    } else if (activeTab === "messages") {
      filtered = filtered.filter(
        (notification) => notification.type === "message"
      );
    } else if (activeTab === "system") {
      filtered = filtered.filter(
        (notification) =>
          notification.type === "system" ||
          notification.type === "alert" ||
          notification.type === "info"
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(query) ||
          notification.message.toLowerCase().includes(query)
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, activeTab, searchQuery]);

   useEffect(() => {
  const fetchNotifications = async () => {
    try {
      setLoading(true); // 🔹 Start loading
      const res = await axios.get("https://api.bizwapp.com/api/auth/notification");
      const logs = res.data;

      const formatted = logs.map((log: any) => ({
        id: log._id,
        type: "system",
        title: log.title,
        message: log.description,
        timestamp: log.createdAt,
        read: false,
      }));

      setNotifications(formatted);
      setFilteredNotifications(formatted);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false); // 🔹 Stop loading
    }
  };

  fetchNotifications();
}, []);

  // Handle marking a notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );

    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );

    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
    });
  };

  // Handle clearing a notification
  const handleClearNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );

    toast({
      title: "Notification removed",
      description: "The notification has been removed.",
    });
  };

  // Handle clearing all notifications
  const handleClearAllNotifications = () => {
    setNotifications([]);
    setClearConfirmOpen(false);

    toast({
      title: "All notifications cleared",
      description: "All notifications have been removed.",
    });
  };

  // Handle viewing notification details
  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setNotificationDetailsOpen(true);

    // Mark as read when viewed
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "system":
        return <Settings className="h-5 w-5 text-purple-500" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "info":
        return <Info className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInSeconds = Math.floor(
      (now.getTime() - notificationTime.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  console.log("notifications" , notifications);
  

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 pt-4 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight pl-6">Notifications</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={handleMarkAllAsRead}
              disabled={!notifications.some((n) => !n.read)}
            >
              <Check className="h-3.5 w-3.5" />
              <span>Mark All as Read</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={() => setClearConfirmOpen(true)}
              disabled={notifications.length === 0}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notifications..."
              className="w-full bg-background pl-8 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 w-full"
        >
          {/* Tabs List */}
          <TabsList className="flex flex-wrap justify-start gap-2 sm:gap-4">
            <TabsTrigger value="all" className="relative">
              All
              {notifications.length > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="relative">
              Unread
              {notifications.filter((n) => !n.read).length > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">
                  {notifications.filter((n) => !n.read).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Tabs Content */}
          <TabsContent value={activeTab} className="space-y-4">
            <Card className="w-full">
              <CardHeader className="p-4">
                <CardTitle className="text-lg sm:text-2xl">
                  {activeTab === "all"
                    ? "All Notifications"
                    : activeTab === "unread"
                    ? "Unread Notifications"
                    : activeTab === "messages"
                    ? "Message Notifications"
                    : "System Notifications"}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  {filteredNotifications.length === 0
                    ? "No notifications to display."
                    : `Showing ${filteredNotifications.length} notification${
                        filteredNotifications.length !== 1 ? "s" : ""
                      }.`}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Bell className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No notifications</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchQuery
                        ? "No notifications match your search."
                        : "You're all caught up! Check back later for new notifications."}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                          !notification.read ? "bg-muted/20" : ""
                        }`}
                        onClick={() => handleViewDetails(notification)}
                      >
                        {/* Left Avatar/Icon */}
                        <div className="flex-shrink-0">
                          {notification.type === "message" &&
                          notification.sender ? (
                            <Avatar>
                              <AvatarImage
                                src={
                                  notification.sender.avatar ||
                                  "/placeholder.svg"
                                }
                              />
                              <AvatarFallback>
                                {notification.sender.initials}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                              {getNotificationIcon(notification.type)}
                            </div>
                          )}
                        </div>

                        {/* Center Content */}
                        <div className="flex-1 space-y-1 overflow-hidden">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <p className="font-medium truncate">
                              {notification.title}
                            </p>
                            <div className="flex items-center gap-1 mt-2 sm:mt-0">
                              {!notification.read && (
                                <Badge className="bg-primary text-primary-foreground">
                                  New
                                </Badge>
                              )}
                              <p className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatRelativeTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                        </div>

                        {/* Right Dropdown */}
                        <div className="flex-shrink-0">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {!notification.read && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification.id);
                                  }}
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  <span>Mark as read</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClearNotification(notification.id);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Remove</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Notification Details Dialog */}
      <Dialog
        open={notificationDetailsOpen}
        onOpenChange={setNotificationDetailsOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          {selectedNotification && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedNotification.title}</DialogTitle>
                <DialogDescription>
                  {formatRelativeTime(selectedNotification.timestamp)} •{" "}
                  {selectedNotification.type.charAt(0).toUpperCase() +
                    selectedNotification.type.slice(1)}{" "}
                  notification
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {selectedNotification.type === "message" &&
                  selectedNotification.sender && (
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarImage
                          src={
                            selectedNotification.sender.avatar ||
                            "/placeholder.svg"
                          }
                        />
                        <AvatarFallback>
                          {selectedNotification.sender.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {selectedNotification.sender.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Sent you a message
                        </p>
                      </div>
                    </div>
                  )}
                <ScrollArea className="max-h-[300px]">
                  <div className="space-y-4">
                    <p className="text-sm">{selectedNotification.message}</p>
                    {selectedNotification.actionUrl && (
                      <div className="pt-2">
                        <Button asChild>
                          <a
                            href={selectedNotification.actionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Details
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
              <DialogFooter className="flex justify-between items-center">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>
                    {new Date(selectedNotification.timestamp).toLocaleString()}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleClearNotification(selectedNotification.id)
                  }
                >
                  Dismiss
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Clear All Confirmation Dialog */}
      <Dialog open={clearConfirmOpen} onOpenChange={setClearConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Notifications</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all notifications? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setClearConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAllNotifications}>
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "message",
    title: "New message from Sarah Johnson",
    message:
      "Thanks for the quick response! The product works great. I wanted to ask about the warranty options available.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    read: false,
    sender: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SJ",
    },
    actionUrl: "/conversations",
  },
  {
    id: "2",
    type: "system",
    title: "System Maintenance",
    message:
      "The system will undergo scheduled maintenance on Saturday, May 15th from 2:00 AM to 4:00 AM UTC. During this time, the service may be temporarily unavailable.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: true,
  },
  {
    id: "3",
    type: "alert",
    title: "Message Delivery Failed",
    message:
      "Your message to +1 (555) 987-6543 could not be delivered. The recipient's phone might be turned off or they may have blocked WhatsApp Business messages.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: false,
  },
  {
    id: "4",
    type: "message",
    title: "New message from Michael Chen",
    message:
      "I'm having trouble with my order #45678. Can you help me track it? I haven't received any updates in the last 3 days.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    read: true,
    sender: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
    },
    actionUrl: "/conversations",
  },
  {
    id: "5",
    type: "info",
    title: "Template Approved",
    message:
      "Your 'Order Confirmation' message template has been approved and is now available for use. You can start sending this template to your customers.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
    actionUrl: "/templates",
  },
  {
    id: "6",
    type: "system",
    title: "Account Verification Required",
    message:
      "Please verify your business account to unlock all features. This helps us ensure that only legitimate businesses use our platform.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    read: false,
    actionUrl: "/settings",
  },
  {
    id: "7",
    type: "alert",
    title: "API Rate Limit Warning",
    message:
      "You're approaching your API rate limit (80% used). Consider upgrading your plan to avoid service interruptions.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    read: true,
    actionUrl: "/api-settings",
  },
  {
    id: "8",
    type: "info",
    title: "New Feature Available",
    message:
      "We've added  message sending capabilities to your account. Now you can send messages to multiple contacts at once, saving you time and effort.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    read: true,
  },
];
