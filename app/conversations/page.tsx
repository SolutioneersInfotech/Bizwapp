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
import NewChatDialog from "../../components/newChat";
import { Spinner } from "@/components/ui/spinner";
import ConversationList from "@/components/ConversationList";
import ChatWindow from "@/components/ChatArea";
import axios from "axios";
import useSendWhatsAppImage from "../../hooks/api/sendImageWhatsapp";

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

  const [contactMessages, setContactMessages] = useState<Message[]>([]);
  const [bulkMessageOpen, setBulkMessageOpen] = useState(false);
  const [bulkMessage, setBulkMessage] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

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
  const [conversation, setConversation] = useState([]);
  const [webhookMessages, setWebhookMessages] = useState([]);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const conversationRef = useRef<any[]>([]); // store latest conversation list
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState<"conversations" | "chat">(
    "conversations"
  );
  const [uniqueConversations, setUniqueConversations] = useState([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [userId , setUserId]= useState(null);
  const [template , setTemplate] =useState({ });
  const [ imagesend , setImageSend ] = useState("")
    const fileInputRef = useRef();


  useEffect(()=>{
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      const id = userData.id || userData.user?._id || null;
      setUserId(id);
    }
  },[]);

  const { data: getAllConversation } = useGetAllConversation(userId);

  useEffect(() => {
    setConversationHistory(getAllConversation?.conversations);
  });

  const { data: messageHistory } = useMessageHistory(selectedPhone);

  useEffect(() => {
    setMessage(messageHistory?.data || []);
  }, [messageHistory]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (getAllConversation?.conversations) {
      setConversationHistory(getAllConversation.conversations);
      conversationRef.current = getAllConversation.conversations;
    }
  }, [getAllConversation]);

  const { data: whatsappTemplates } = useWhatsAppTemplates();

  useEffect(() => {
    let result = [...conversations];

    if (activeTab === "unread") {
      result = result.filter((conversation) => conversation.unread > 0);
    } else if (activeTab === "archived") {
      result = result.filter((conversation) => conversation.archived);
    }
  }, [searchQuery, activeTab]);



  const {
    data: getContacts,
    loading,
    error,
  } = useGetContacts(`https://api.bizwapp.com/api/auth/getContacts/${userId}`);

  useEffect(() => {
    setContact(getContacts);
  }, [getContacts]);

  useEffect(() => {
    if (contacts && contacts.contacts) {
      setFilteredConversations(contacts.contacts);
    }
  });

  useEffect(() => {
    const unique = conversationHistory
      ? Array.from(
          new Map(
            conversationHistory.map((convo) => [convo.phoneNumber, convo])
          ).values()
        )
      : [];

    setUniqueConversations(unique);
  }, [conversationHistory]);

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


    const {mutate : sendImageMutation} = useSendWhatsAppMessage()

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

    const contactsToSend = contacts?.contacts
          .filter((contact) => selectedContacts.includes(contact.phone))
          .map((contact) => ({
            phoneNumber: contact.phone,
            name: contact.name,
          }));

    if (!imagesend){
      sendImageMutation({ contacts :contactsToSend, imageUrl})
      return;
    }
    try {

      const contactsToSend = contacts?.contacts
          .filter((contact) => selectedContacts.includes(contact.phone))
          .map((contact) => ({
            phoneNumber: contact.phone,
            name: contact.name,
          }));
      // In a rea
      // l app, you would call the API to send bulk messages
      if (bulkMessageTab === "text") {
        

        let messageToSend = bulkMessage;

        console.log("contactsToSend", contactsToSend);
        console.log("messageToSend", messageToSend)

        mutate({
          userId:userId,
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
          userId:userId,
          contacts: contactsToSend,
          message: templateMessage,
        });

        mutate({
          userId:userId,
          contacts: contactsToSend,
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
      console.error("Mutation failed", error);
      toast({
        title: "Error",
        description: "Failed to send bulk message",
        variant: "destructive",
      });
    }
  };

  const { mutate  } = useSendWhatsAppImage();


  const handleSendTemplate = async (templateId: string) => {
    if (!selectedContact) return;

    const template = templates.find((t) => t.id === templateId);
    console.log("templatevvvvvvvvv", template)
    if(template){
      setTemplate(template);
    }
    if (!template) return;

    try {
      // In a real app, you would call the API to send a template message
      console.log("selectedContact",selectedContact)
      const simplifiedContacts = [{
        phoneNumber: selectedContact.phoneNumber,
        name: selectedContact.name
      }];
      

      let cleanedMessage = template.content.replace(/\\\"/g,'');
      
      mutate({
        userId:userId,
        contacts: simplifiedContacts,
        message: cleanedMessage,
      });
      setTemplateDialogOpen(false);

      toast({
        title: "Template Sent",
        description: `Template "${template.name}" sent successfully`,
      });
    } catch (error) {
      console.error("Template send error:", error);
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

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };


  const handleFileChange = async (event) => {
    console.log("svgvsjdgvjgvsj")
    const file = event.target.files[0];
    if (!file) return;

    // Cloudinary upload logic
    const formData = new FormData();
    formData.append('file', file);
    console.log("filefilefile", file)
    formData.append('upload_preset', 'preset'); // Replace with your preset

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/di3jsead7/image/upload',
        formData
      );
      const imageUrl = response.data.secure_url;
      console.log('Uploaded Image URL:', imageUrl);
      setImageSend(imageUrl)
      // if (onUpload) onUpload(imageUrl);
      
    } catch (error) {
      console.error('Upload error:', error);
    }
  };


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

  // const sortedMessages = [...message].sort(
  //   (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  // );

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col md:flex-row">
  {/* Conversations Panel (Left Sidebar) */}
  <div className="w-full md:w-80 lg:w-96 border-r">
    <div className="flex h-14 items-center justify-between border-b px-4 mt-1">
      <h2 className="font-semibold m-8 md:m-0">Conversations</h2>
      <div className="flex items-center gap-2">
        {/* Bulk Message Dialog */}
        <Dialog open={bulkMessageOpen} onOpenChange={setBulkMessageOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Bulk Message</Button>
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
                  <Label htmlFor="bulk-message">Message</Label>
                  <Textarea
                    id="bulk-message"
                    placeholder="Type your message here..."
                    value={bulkMessage}
                    onChange={(e) => setBulkMessage(e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="template" className="mt-4">
                <div className="grid gap-4 py-4">
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
                  </Select>

                  {selectedBulkTemplate && (
                    <div className="mt-2 rounded-md border p-3 text-sm space-y-1">
                      {separatedTexts
                        .find(t => t.templateName === selectedBulkTemplate)
                        ?.texts.map((text, index) => (
                          <div key={index}>{text}</div>
                        ))}
                    </div>
                  )}

                  {selectedBulkTemplate && (
                    <div className="mt-2 rounded-md border p-3 text-sm">
                      {
                        templates.find(t => t.id === selectedBulkTemplate)?.content
                      }
                    </div>
                  )}
                </div>
                <button className="w-full px-4 py-2 rounded hover:bg-green-600 hover:text-white transition bg-white-700 text-green-600 border border-green-600" onClick={handleButtonClick}>
                Select Image File
              </button>
              <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              />
              </TabsContent>
            </Tabs>

            <div className="grid gap-4 py-4">
              <Label>Select Contacts ({selectedContacts.length} selected)</Label>
              <ScrollArea className="h-[200px] rounded-md border p-2">
                {contacts?.contacts?.length > 0 ? (
                  contacts.contacts.map((contact) => (
                    <div key={contact._id} className="flex items-center gap-2 py-2">
                      <input
                        type="checkbox"
                        id={`contact-${contact._id}`}
                        checked={selectedContacts.includes(contact.phone)}
                        onChange={() => toggleContactSelection(contact.phone)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label
                        htmlFor={`contact-${contact._id}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>{contact.initials}</AvatarFallback>
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

            <DialogFooter>
              <Button variant="outline" onClick={() => setBulkMessageOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendBulkMessage} disabled={selectedContacts.length === 0}>
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

    {/* Conditional Rendering: Mobile or Desktop Conversation List */}
    {isMobile ? (
      mobileView === "conversations" && (
        <div className="w-full">
          <ConversationList
            isMobile={isMobile}
            setMobileView={setMobileView}
            searchQuery={searchQuery}
            setSelectedPhone={setSelectedPhone}
            setMessages={setMessage}
            setSearchQuery={setSearchQuery}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            loading={loading}
            uniqueConversations={uniqueConversations}
            selectedContact={selectedContact}
            setSelectedContact={setSelectedContact}
            selectedContacts={selectedContacts}
            bulkMessageOpen={bulkMessageOpen}
            toggleContactSelection={toggleContactSelection}
            handleDeleteConversation={handleDeleteConversation}
            handleMuteConversation={handleMuteConversation}
            setNewChatDialogOpen={setNewChatDialogOpen}
            conversationHistory={[]}
            selectedContact={null}
            handleContactSelect={() => {}}
            handleArchiveConversation={() => {}}
          />
        </div>
      )
    ) : (
      <ConversationList
        searchQuery={searchQuery}
        setSelectedPhone={setSelectedPhone}
        setMessages={setMessage}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loading={loading}
        uniqueConversations={uniqueConversations}
        selectedContact={selectedContact}
        setSelectedContact={setSelectedContact}
        selectedContacts={selectedContacts}
        bulkMessageOpen={bulkMessageOpen}
        toggleContactSelection={toggleContactSelection}
        handleDeleteConversation={handleDeleteConversation}
        handleMuteConversation={handleMuteConversation}
        setNewChatDialogOpen={setNewChatDialogOpen}
        conversationHistory={[]}
        selectedContact={null}
        handleContactSelect={() => {}}
        handleArchiveConversation={() => {}}
      />
    )}
  </div>

  {/* Chat Panel (Right Side) */}
  {isMobile ? (
    mobileView === "chat" && (
      <div className="w-full">
        <ChatWindow
         isMobile={isMobile}
         setMobileView={setMobileView}
          selectedContact={selectedContact}
          selectedPhone={selectedPhone}
          message={message}
          setMessage={setMessage}
          messageLoading={messageLoading}
          handleMuteConversation={handleMuteConversation}
          handleDeleteConversation={handleDeleteConversation}
          templates={templates}
          template={template}
          handleSendTemplate={handleSendTemplate}
          templateDialogOpen={templateDialogOpen}
          setTemplateDialogOpen={setTemplateDialogOpen}
          setNewChatDialogOpen={setNewChatDialogOpen}
        />
      </div>
    )
  ) : (
    <div className="flex-1">
      <ChatWindow
        selectedContact={selectedContact}
        selectedPhone={selectedPhone}
        message={message}
        setMessage={setMessage}
        messageLoading={messageLoading}
        handleMuteConversation={handleMuteConversation}
        handleDeleteConversation={handleDeleteConversation}
        templates={templates}
        template={template}
        handleSendTemplate={handleSendTemplate}
        templateDialogOpen={templateDialogOpen}
        setTemplateDialogOpen={setTemplateDialogOpen}
        setNewChatDialogOpen={setNewChatDialogOpen}
      />
    </div>
  )}

  {/* New Chat Dialog */}
  <NewChatDialog
    open={newChatDialogOpen}
    onOpenChange={setNewChatDialogOpen}
    phone={newChatPhone}
    onPhoneChange={setNewChatPhone}
    message={newChatMessage}
    onMessageChange={setNewChatMessage}
    onSubmit={handleStartNewChat}
  />
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
