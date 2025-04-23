"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  MoreVertical,
  Paperclip,
  Send,
  Smile,
  ImageIcon,
  Mic,
  Loader2,
  CheckCircle,
  Check,
  Plus,
  Archive,
  Trash2,
  Bell,
  BellOff,
  UserPlus,
  Tag,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/contexts/MessageContext";
import { useTemplates } from "@/contexts/TemplateContext";
import type { Contact, Message } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetContacts from "@/hooks/api/useGetContact";
import useSendWhatsAppMessage from "../../hooks/api/useSendWhatsAppMessage "; // Adjust path as needed
import { useWhatsAppTemplates } from "@/hooks/api/getTemplate";
import useMessageHistory from "../../hooks/api/getMessageHistory";
import useUpdateUnread from "../../hooks/api/updateUnreadStatus";
import useGetAllConversation from "../../hooks/api/getAllConversation";
import { io, Socket } from "socket.io-client";

export default function ConversationsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    messages,
    sendMessage,
    getMessageHistory,
    isLoading: messageLoading,
    currentContact,
    setCurrentContact,
  } = useMessages();
  const { templates } = useTemplates();
  const { toast } = useToast();

  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactMessages, setContactMessages] = useState<Message[]>([]);
  const [bulkMessageOpen, setBulkMessageOpen] = useState(false);
  const [bulkMessage, setBulkMessage] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New state for bulk message template
  const [bulkMessageTab, setBulkMessageTab] = useState("text");
  const [selectedBulkTemplate, setSelectedBulkTemplate] = useState("");

  // New state for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [newChatPhone, setNewChatPhone] = useState("");
  const [newChatMessage, setNewChatMessage] = useState("");
  const [contacts, setContact] = useState<Contact[] | null>(null);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [webhookMessages, setWebhookMessages] = useState([]);
  const [selectedName , setSelectedName]= useState<String | null>(null)
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const conversationRef = useRef<any[]>([]); // store latest conversation list
  const socketRef = useRef<Socket | null>(null);


  const { data: messageHistory } = useMessageHistory(selectedPhone);

  const message = messageHistory?.data || [];

  const { data: getAllConversation } = useGetAllConversation();

  useEffect(()=>{
    setConversationHistory(getAllConversation?.conversations)
  })

  useEffect(() => {
    if (getAllConversation?.conversations) {
      setConversationHistory(getAllConversation.conversations);
      conversationRef.current = getAllConversation.conversations;
    }
  }, [getAllConversation]);

  // Setup socket
  // Update your socket effect to properly handle new messages
useEffect(() => {
  socketRef.current = io("https://c8af-2405-201-601e-b036-d5c2-a462-1436-1af9.ngrok-free.app", {
    transports: ["websocket"],
  });

  socketRef.current.on("newMessage", (msg) => {
    console.log("📩 New message received:", msg);

    // Check if this message belongs to the currently selected conversation
    if (selectedPhone && msg.phoneNumber === selectedPhone) {
      // Update the message history for the current conversation
      setConversationHistory(prevMessages => [...prevMessages, msg]);
    }

    // Update the conversation list to show new message preview
    setConversationHistory(prev => {
      // Find if this conversation already exists
      const existingIndex = prev.findIndex(c => c.phoneNumber === msg.phoneNumber);
      
      if (existingIndex >= 0) {
        // Update existing conversation
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          lastMessage: msg.text || msg.body,
          timestamp: msg.timestamp,
          unread: selectedPhone !== msg.phoneNumber ? 
            (updated[existingIndex].unread || 0) + 1 : 
            updated[existingIndex].unread
        };
        return updated;
      } else {
        // Add new conversation
        return [{
          phoneNumber: msg.phoneNumber,
          name: msg.name || msg.phoneNumber,
          lastMessage: msg.text || msg.body,
          timestamp: msg.timestamp,
          unread: 1
        }, ...prev];
      }
    });
  });

  return () => {
    socketRef.current?.disconnect();
  };
}, [conversationHistory]); // Add selectedPhone as dependency

const sortedMessages = useMemo(() => {
  return [...message].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}, [message]);


// Auto-scroll effect
useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [sortedMessages]); // Trigger when sortedMessages changes

  // Redirect if not authenticated
  // useEffect(() => {
  //   if (!authLoading && !isAuthenticated) {
  //     router.push("/login");
  //   }
  // }, [authLoading, isAuthenticated, router]);

  const { data: whatsappTemplates } = useWhatsAppTemplates();

 
  useEffect(() => {
    if (currentContact && !selectedContact) {
      setSelectedContact(currentContact);
    }
  }, [currentContact, selectedContact]);


  useEffect(() => {
    let result = [...conversations];

    if (activeTab === "unread") {
      result = result.filter((conversation) => conversation.unread > 0);
    } else if (activeTab === "archived") {
      result = result.filter((conversation) => conversation.archived);
    }

    // Filter by search query
    // if (searchQuery) {
    //   const query = searchQuery.toLowerCase();
    //   result = result.filter(
    //     (conversation) =>
    //       conversation.name.toLowerCase().includes(query) ||
    //       conversation.lastMessage.toLowerCase().includes(query) ||
    //       conversation.phone.includes(query)
    //   );
    // }

    // setFilteredConversations(result);
  }, [searchQuery, activeTab]);

  const {
    data: getContacts,
    loading,
    error,
  } = useGetContacts(
    "https://api.bizwapp.com/api/auth/getContacts"
  );

  useEffect(() => {
    setContact(getContacts);
  }, [getContacts]);

  useEffect(() => {
    if (contacts && contacts.contacts) {
      setFilteredConversations(contacts.contacts);
    }
  });

  // const allTemplates = [/* your template objects */];
  const separatedTexts = Array.isArray(whatsappTemplates?.data)
    ? whatsappTemplates.data.map((template) => {
        return {
          templateName: template.name,
          texts: template.components
            .filter((component) => component.text)
            .map((component) => component.text),
        };
      })
    : [];

  const { mutate: unreadStatus } = useUpdateUnread();

  const handleContactSelect = (contact: Contact, phone , name) => {
    // console.log("checking.");
    // console.log("contact", "phone", contact, phone);

    unreadStatus(phone);
    setSelectedName(name)
    setSelectedContact(contact);
    setCurrentContact(contact);
    setSelectedPhone(phone); 
  };

  const { mutate, isLoading, data } = useSendWhatsAppMessage();


  const handleSendMessage = async () => {
    if (!selectedContact || !newMessage.trim()) return;
  
  console.log("we are inside handleSendMessage")
    mutate({
      contacts: [
        {
          phoneNumber: selectedPhone,
          name: selectedName,
        },
      ],
      message: newMessage,
    });
  
    await sendMessage(selectedContact.phone, newMessage);
    setNewMessage("");
  };
  
  const handleSendBulkMessage = async () => {
    if (
      bulkMessageTab === "text" &&
      (!bulkMessage.trim() || selectedContacts.length === 0)
    ) {
      toast({
        title: "Error",
        description: "Please enter a message and select at least one contact",
        variant: "destructive",
      });
      return;
    }

    if (
      bulkMessageTab === "template" &&
      (!selectedBulkTemplate || selectedContacts.length === 0)
    ) {
      toast({
        title: "Error",
        description: "Please select a template and at least one contact",
        variant: "destructive",
      });
      return;
    }
    try {
      // In a real app, you would call the API to send bulk messages
      if (bulkMessageTab === "text") {
        const contactsToSend = contacts?.contacts
          .filter((contact) => selectedContacts.includes(contact.phone))
          .map((contact) => ({
            phoneNumber: contact.phone,
            name: contact.name,
          }));

        let messageToSend = bulkMessage;

        mutate({
          contacts: contactsToSend,
          message: messageToSend,
        });
      } else {
        const template = separatedTexts.find(
          (t) => t.templateName === selectedBulkTemplate
        );
        if (!template) return;

        const templateMessage = template.texts.join("\n"); // or ". " if preferred

        console.log("Sending template message to backend:", {
          phoneNumbers: selectedContacts,
          message: templateMessage,
        });

        mutate({
          phoneNumbers: selectedContacts,
          message: templateMessage,
        });
      }

      toast({
        title: "Bulk Message Sent",
        description: `Message sent to ${selectedContacts.length} contacts`,
      });

      setBulkMessage("");
      setSelectedBulkTemplate("");
      setSelectedContacts([]);
      setBulkMessageOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send bulk message",
        variant: "destructive",
      });
    }
  };

  const handleSendTemplate = async (templateId: string) => {
    if (!selectedContact) return;

    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    try {
      // In a real app, you would call the API to send a template message
      await sendMessage(
        selectedContact.phone,
        `[Template: ${template.name}] ${template.content}`
      );
      setTemplateDialogOpen(false);

      toast({
        title: "Template Sent",
        description: `Template "${template.name}" sent successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send template",
        variant: "destructive",
      });
    }
  };

  const toggleContactSelection = (phone: string) => {
    setSelectedContacts((prev) =>
      prev.includes(phone) ? prev.filter((p) => p !== phone) : [...prev, phone]
    );
  };

  const handleStartNewChat = async () => {
    if (!newChatPhone) {
      toast({
        title: "Error",
        description: "Phone number is required",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if contact exists
      const existingContact = conversations.find(
        (c) => c.phone === newChatPhone
      );

      if (existingContact) {
        // If contact exists, select it
        handleContactSelect(existingContact);
      } else {
        // Create a new contact
        const newContact = {
          id: Date.now(),
          name: `New Contact (${newChatPhone})`,
          initials: "NC",
          avatar: "/placeholder.svg?height=40&width=40",
          lastMessage: "",
          time: "Just now",
          unread: 0,
          phone: newChatPhone,
          email: "",
          tags: ["New"],
          status: "Active",
          archived: false,
        };

        // Add to conversations (in a real app, this would be an API call)
        conversations.push(newContact);

        // Select the new contact
        handleContactSelect(newContact);

        // Send initial message if provided
        if (newChatMessage) {
          await sendMessage(newChatPhone, newChatMessage);
        }
      }

      setNewChatDialogOpen(false);
      setNewChatPhone("");
      setNewChatMessage("");

      toast({
        title: "Chat Started",
        description: "New conversation has been started",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start new chat",
        variant: "destructive",
      });
    }
  };

  // const handleArchiveConversation = (contact) => {
  //   // In a real app, this would be an API call
  //   const index = conversations.findIndex((c) => c.id === contact.id);
  //   if (index !== -1) {
  //     conversations[index].archived = !conversations[index].archived;

  //     toast({
  //       title: conversations[index].archived
  //         ? "Conversation Archived"
  //         : "Conversation Unarchived",
  //       description: `Conversation with ${contact.name} has been ${
  //         conversations[index].archived ? "archived" : "unarchived"
  //       }`,
  //     });

  //     // Refresh filtered conversations
  //     setFilteredConversations([...filteredConversations]);
  //   }
  // };

  const handleDeleteConversation = (contact) => {
    // In a real app, this would be an API call
    const index = conversations.findIndex((c) => c.id === contact.id);
    if (index !== -1) {
      conversations.splice(index, 1);

      toast({
        title: "Conversation Deleted",
        description: `Conversation with ${contact.name} has been deleted`,
      });

      // Refresh filtered conversations
      // setFilteredConversations([
      //   ...filteredConversations.filter((c) => c.id !== contact.id),
      // ]);

      // If the deleted contact was selected, clear selection
      if (selectedContact && selectedContact.id === contact.id) {
        setSelectedContact(null);
      }
    }
  };

  const handleMuteConversation = (contact) => {
    // In a real app, this would be an API call
    const index = conversations.findIndex((c) => c.id === contact.id);
    if (index !== -1) {
      conversations[index].muted = !conversations[index].muted;

      toast({
        title: conversations[index].muted
          ? "Conversation Muted"
          : "Conversation Unmuted",
        description: `Notifications for ${contact.name} have been ${
          conversations[index].muted ? "muted" : "unmuted"
        }`,
      });

      // Refresh filtered conversations
      // setFilteredConversations([...filteredConversations]);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const uniqueConversations = conversationHistory
  ? Array.from(
      new Map(
        conversationHistory.map((convo) => [
          convo.phoneNumber,
          convo,
        ])
      ).values()
    )
  : [];

  // const sortedMessages = [...message].sort(
  //   (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  // );
  

console.log("conversationHistory", conversationHistory);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col md:flex-row">
      {/* Conversations List */}
      <div className="w-full border-r md:w-80 lg:w-96">
        <div className="flex h-14 items-center justify-between border-b px-4">
          <h2 className="font-semibold">Conversations</h2>
          <div className="flex items-center gap-2">
            <Dialog open={bulkMessageOpen} onOpenChange={setBulkMessageOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Bulk Message
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Send Bulk Message</DialogTitle>
                  <DialogDescription>
                    Send a message to multiple contacts at once.
                  </DialogDescription>
                </DialogHeader>
                <Tabs value={bulkMessageTab} onValueChange={setBulkMessageTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Text Message</TabsTrigger>
                    <TabsTrigger value="template">Template</TabsTrigger>
                  </TabsList>
                  <TabsContent value="text" className="mt-4">
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="bulk-message">Message</Label>
                        <Textarea
                          id="bulk-message"
                          placeholder="Type your message here..."
                          value={bulkMessage}
                          onChange={(e) => setBulkMessage(e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="template" className="mt-4">
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="template-select">Select Template</Label>
                        <Select
                          value={selectedBulkTemplate}
                          onValueChange={setSelectedBulkTemplate}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a template" />
                          </SelectTrigger>
                          <SelectContent>
                            {separatedTexts.map((template) => (
                              <SelectItem
                                key={template.templateName}
                                value={template.templateName}
                              >
                                {template.templateName}
                              </SelectItem>
                            ))}
                          </SelectContent>

                          {selectedBulkTemplate && (
                            <div className="mt-2 rounded-md border p-3 text-sm space-y-1">
                              {separatedTexts
                                .find(
                                  (t) => t.templateName === selectedBulkTemplate
                                )
                                ?.texts.map((text, index) => (
                                  <div key={index}> {text}</div>
                                ))}
                            </div>
                          )}
                        </Select>
                        {selectedBulkTemplate && (
                          <div className="mt-2 rounded-md border p-3 text-sm">
                            {
                              templates.find(
                                (t) => t.id === selectedBulkTemplate
                              )?.content
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>
                      Select Contacts ({selectedContacts.length} selected)
                    </Label>
                    <ScrollArea className="h-[200px] rounded-md border p-2">
                      {contacts?.contacts?.length > 0 ? (
                        contacts.contacts.map((contact) => (
                          <div
                            key={contact._id}
                            className="flex items-center gap-2 py-2"
                          >
                            <input
                              type="checkbox"
                              id={`contact-${contact._id}`}
                              checked={selectedContacts.includes(contact.phone)}
                              onChange={() =>
                                toggleContactSelection(contact.phone)
                              }
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label
                              htmlFor={`contact-${contact._id}`}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={contact.avatar} />
                                <AvatarFallback>
                                  {contact.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span>{contact.name}</span>
                            </Label>
                          </div>
                        ))
                      ) : (
                        <p>No contacts found</p>
                      )}
                    </ScrollArea>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setBulkMessageOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendBulkMessage}
                    disabled={selectedContacts.length === 0}
                  >
                    Send to {selectedContacts.length} contacts
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search conversations..."
              className="w-full bg-background pl-8 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="px-4"
        >
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              Unread
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex-1">
              Archived
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value={activeTab}
            className="mt-4 space-y-2 max-h-[calc(100vh-130px)] overflow-y-auto pr-2 md:max-h-[500px]"
            >
            {(conversationHistory?.length ?? 0) === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No conversations found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : "Start a new conversation to get started"}
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setNewChatDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Chat
                </Button>
              </div>
            ) : (
              uniqueConversations.map((conversation) => (
                <div
                  className={conversation.unread ? "font-bold" : "font-light"}
                >
                  <ConversationItem
                    key={conversation._id}
                    conversation={conversation}
                    isActive={selectedContact?._id === conversation._id}
                    onSelect={() =>
                      handleContactSelect(
                        conversation,
                        conversation.phoneNumber,
                        conversation.name
                      )
                    }
                    isSelected={selectedContacts.includes(
                      conversation.phoneNumber
                    )}
                    onToggleSelect={() =>
                      toggleContactSelection(conversation.phoneNumber)
                    }
                    selectionMode={bulkMessageOpen}
                    onArchive={() => handleArchiveConversation(conversation)}
                    onDelete={() => handleDeleteConversation(conversation)}
                    onMute={() => handleMuteConversation(conversation)}
                  />
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {selectedContact ? (
          <>
            <div className="flex h-14 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={selectedContact.avatar} />
                  <AvatarFallback>{selectedContact.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedContact.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedContact.status === "Active" ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Conversation Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleMuteConversation(selectedContact)}
                    >
                      {selectedContact.muted ? (
                        <>
                          <Bell className="mr-2 h-4 w-4" />
                          <span>Unmute Notifications</span>
                        </>
                      ) : (
                        <>
                          <BellOff className="mr-2 h-4 w-4" />
                          <span>Mute Notifications</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Add to Contacts</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Tag className="mr-2 h-4 w-4" />
                      <span>Manage Tags</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleArchiveConversation(selectedContact)}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      <span>
                        {selectedContact.archived ? "Unarchive" : "Archive"}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteConversation(selectedContact)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Conversation</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 h-[calc(100vh-220px)] md:h-auto">

              <div className="space-y-4">
                {message.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  sortedMessages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${
                        message.direction === "outbound"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.direction === "outbound"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <div className="mt-1 flex items-center justify-end gap-1 text-xs opacity-70">
                          <span>
                            {new Date(message.timestamp).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </span>
                          {message.direction === "outbound" && (
                            <span>
                              {message.status === "sent" && (
                                <Check className="h-3 w-3" />
                              )}
                              {message.status === "delivered" && (
                                <Check className="h-3 w-3" />
                              )}
                              {message.status === "read" && (
                                <CheckCircle className="h-3 w-3" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="relative flex-1">
                  <Input
                    placeholder="Type a message..."
                    className="pr-24"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  size="icon"
                  className="rounded-full"
                  onClick={handleSendMessage}
                  disabled={messageLoading || !newMessage.trim()}
                >
                  {messageLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Quick Reply
                </Button>
                <Dialog
                  open={templateDialogOpen}
                  onOpenChange={setTemplateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      Templates
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select a Template</DialogTitle>
                      <DialogDescription>
                        Choose a template to send to {selectedContact.name}
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[300px] rounded-md border p-4">
                      <div className="grid gap-4">
                        {templates
                          .filter((t) => t.status === "Approved")
                          .map((template) => (
                            <div
                              key={template.id}
                              className="rounded-lg border p-3 cursor-pointer hover:bg-muted"
                              onClick={() => handleSendTemplate(template.id)}
                            >
                              <h4 className="font-medium">{template.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {template.content}
                              </p>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setTemplateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Assign
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a contact to start messaging
              </p>
              <Button
                className="mt-4"
                onClick={() => setNewChatDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Chat
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Dialog */}
      <Dialog open={newChatDialogOpen} onOpenChange={setNewChatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Chat</DialogTitle>
            <DialogDescription>
              Enter a phone number to start a new conversation
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter phone number with country code"
                value={newChatPhone}
                onChange={(e) => setNewChatPhone(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Include country code, e.g., +1234567890
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="initial-message">
                Initial Message (Optional)
              </Label>
              <Textarea
                id="initial-message"
                placeholder="Type your first message..."
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewChatDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleStartNewChat}>Start Chat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ConversationItem({
  conversation,
  isActive,
  onSelect,
  isSelected,
  onToggleSelect,
  selectionMode,
  onArchive,
  onDelete,
  onMute,
}) {
  return (
    <div
      className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors ${
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "hover:bg-muted/50"
      }`}
      onClick={selectionMode ? onToggleSelect : onSelect}
    >
      {selectionMode && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="h-4 w-4 rounded border-gray-300"
          onClick={(e) => e.stopPropagation()}
        />
      )}
      <Avatar>
        <AvatarImage src={conversation.avatar} />
        <AvatarFallback>{conversation.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium truncate">{conversation.phoneNumber}</p>
          <p className="text-xs text-muted-foreground">{conversation.time}</p>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {conversation.lastMessage}
        </p>
      </div>
      {conversation.unread > 0 && (
        <Badge className="ml-auto bg-primary text-primary-foreground">
          {conversation.unread}
        </Badge>
      )}
      {!selectionMode && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onMute();
              }}
            >
              {conversation.muted ? (
                <>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Unmute</span>
                </>
              ) : (
                <>
                  <BellOff className="mr-2 h-4 w-4" />
                  <span>Mute</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onArchive();
              }}
            >
              <Archive className="mr-2 h-4 w-4" />
              <span>{conversation.archived ? "Unarchive" : "Archive"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

// Mock data for conversations
const conversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    initials: "SJ",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for the quick response! The product works great.",
    time: "2m",
    unread: 2,
    phone: "+1234567890",
    email: "sarah.j@example.com",
    tags: ["Customer", "Premium"],
    status: "Active",
    archived: false,
    muted: false,
  },
  {
    id: 2,
    name: "Michael Chen",
    initials: "MC",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I'm having trouble with my order #45678. Can you help?",
    time: "15m",
    unread: 1,
    phone: "+1987654321",
    email: "michael.c@example.com",
    tags: ["Customer", "Support"],
    status: "Active",
    archived: false,
    muted: false,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    initials: "ER",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage:
      "Do you have this item in blue? I only see red on the website.",
    time: "1h",
    unread: 0,
    phone: "+1122334455",
    email: "emily.r@example.com",
    tags: ["Lead", "Retail"],
    status: "Inactive",
    archived: false,
    muted: true,
  },
  {
    id: 4,
    name: "David Kim",
    initials: "DK",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "When will my order ship? I placed it 2 days ago.",
    time: "3h",
    unread: 0,
    phone: "+1555666777",
    email: "david.k@example.com",
    tags: ["Customer", "Enterprise"],
    status: "Active",
    archived: true,
    muted: false,
  },
  {
    id: 5,
    name: "Lisa Wang",
    initials: "LW",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I'd like to return this item. What's the process?",
    time: "5h",
    unread: 0,
    phone: "+1777888999",
    email: "lisa.w@example.com",
    tags: ["Lead", "E-commerce"],
    status: "Inactive",
    archived: false,
    muted: false,
  },
  {
    id: 6,
    name: "James Wilson",
    initials: "JW",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Is there a discount for bulk orders?",
    time: "1d",
    unread: 0,
    phone: "+1999000111",
    email: "james.w@example.com",
    tags: ["Lead", "Wholesale"],
    status: "Active",
    archived: false,
    muted: false,
  },
];
