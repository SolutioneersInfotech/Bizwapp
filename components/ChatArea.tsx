"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Picker, { Emoji } from "emoji-picker-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import useSendWhatsAppMessage from "@/hooks/api/useSendWhatsAppMessage ";
import { Socket } from "dgram";

import {
  Archive,
  ArrowLeft,
  Bell,
  BellOff,
  Camera,
  Check,
  CheckCircle,
  File,
  ImageIcon,
  Loader2,
  Mic,
  MoreVertical,
  Paperclip,
  Plus,
  Search,
  Send,
  Smile,
  Tag,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import EmojiPicker from "./ui/emoji-picker";

interface Message {
  _id: string;
  message: string;
  direction: "inbound" | "outbound";
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

interface Template {
  id: string;
  name: string;
  content: string;
  status: string;
}

interface Contact {
  name: string;
  initials: string;
  avatar: string;
  status: "Active" | "Offline";
  muted: boolean;
  archived: boolean;
}

interface ChatWindowProps {
  selectedContact: Contact | null;
  messages: Message[];
  // sortedMessages: Message[]
  newMessage: string;
  messageLoading: boolean;
  templateDialogOpen: boolean;
  templates: Template[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  setNewMessage: (msg: string) => void;
  setTemplateDialogOpen: (open: boolean) => void;
  setNewChatDialogOpen: (open: boolean) => void;
  handleSendMessage: () => void;
  handleMuteConversation: (contact: Contact) => void;
  handleArchiveConversation: (contact: Contact) => void;
  handleDeleteConversation: (contact: Contact) => void;
  handleSendTemplate: (templateId: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  isMobile,
  setMobileView,
  message,
  setMessage,
  selectedContact,
  messages,
  // sortedMessages,
  messageLoading,
  templateDialogOpen,
  templates,
  // messagesEndRef,
  setTemplateDialogOpen,
  setNewChatDialogOpen,
  // handleSendMessage,
  handleMuteConversation,
  handleArchiveConversation,
  handleDeleteConversation,
  handleSendTemplate,
  template,
}) => {
  const selectedPhone = selectedContact?.phoneNumber;
  const selectedName = selectedContact?.name;
  const [open, setOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
    const [showPicker, setShowPicker] = useState(false);

  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(()=>{
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      const id = userData.id || userData.user?._id || null;
      setUserId(id);
    }
  },[]);

  useEffect(() => {
    socketRef.current = io("https://bizwapp-backend-2.onrender.com", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("newMessage", (msg) => {
      console.log("📩 New message received:", msg);

      if (selectedPhone && msg.phoneNumber === selectedPhone) {
        setMessage((prevMessages) => [...prevMessages, msg]);
      }

      setConversationHistory((prev) => {
        const existingIndex = prev.findIndex(
          (c) => c.phoneNumber === msg.phoneNumber
        );

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            lastMessage: msg.text || msg.body,
            timestamp: msg.timestamp,
            unread:
              selectedPhone !== msg.phoneNumber
                ? (updated[existingIndex].unread || 0) + 1
                : updated[existingIndex].unread,
          };
          return updated;
        } else {
          // Add new conversation
          return [
            {
              phoneNumber: msg.phoneNumber,
              name: msg.name || msg.phoneNumber,
              lastMessage: msg.text || msg.body,
              timestamp: msg.timestamp,
              unread: 1,
            },
            ...prev,
          ];
        }
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [selectedPhone, setMessage]);

  const sortedMessages = useMemo(() => {
    return [...message].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  }, [message]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sortedMessages]);

  useEffect(()=>{
    // setMessage((prev) => [...prev, template.content]);
    const messageToSend = {
      message: template.content,
      name: "user", // or however you identify the sender
      timestamp: new Date().toISOString(),
      direction: "outbound",
    };
    setMessage((prev) => [...prev, messageToSend]);
  }, [template.content])


  const { mutate, isLoading, data } = useSendWhatsAppMessage();

  const handleSendMessage = async () => {
    if (!selectedContact || !newMessage.trim()) return;

    const messageToSend = {
      message: newMessage,
      name: "user", // or however you identify the sender
      timestamp: new Date().toISOString(),
      direction: "outbound",
    };
    setMessage((prev) => [...prev, messageToSend]);
    setNewMessage("");
    mutate({
      userId: userId,
      contacts: [
        {
          phoneNumber: selectedPhone,
          name: selectedName,
        },
      ],
      message: newMessage,
    });

    setNewMessage("");
  };

  const handleDocumentUpload = () => {
    fileInputRef.current?.click();
    setOpen(false);
  };

  const handleImageUpload = () => {
    imageInputRef.current?.click();
    setOpen(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
  };

  return (
    <div className="flex flex-col h-screen">
      {selectedContact ? (
        <>
          {/* Header */}
          <div className="flex h-14 items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
              {isMobile && (
                <button
                  onClick={() => setMobileView("conversations")}
                  className="text-lg  "
                >
                  <ArrowLeft size={20} />
                </button>
              )}
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

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:h-auto max-h-[calc(100vh-220px)]">
            <div className="space-y-4">
              {messages?.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                sortedMessages.map((message) => (
                  <div
                    key={message.timestamp}
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
                          {new Date(message.createdAt).toLocaleTimeString(
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

          {/* Message Input */}
          <div className="border-t px-4 py-4 mt-10 relative sticky bottom-0 bg-white ">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(!open)}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              {open && (
                <div className="absolute bottom-14 right-16 bg-white rounded-lg shadow-lg p-2 w-40 z-50">
                  <div
                    onClick={handleDocumentUpload}
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    <File className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Document</span>
                  </div>
                  <div
                    onClick={handleImageUpload}
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Gallery</span>
                  </div>
                  <div
                    onClick={() => {
                      handleOpenCamera();
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Camera</span>
                  </div>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => console.log("Doc Selected", e.target.files)}
              />
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                className="hidden"
                onChange={(e) => console.log("Image Selected", e.target.files)}
              />

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
                  {/* <Button variant="ghost" size="icon" className="h-8 w-8" onClick={()=>setShowPicker(!showPicker)}> */}
                    <EmojiPicker  onEmojiSelect={handleEmojiSelect} />
                  {/* </Button> */}
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

            {/* Quick Action Buttons */}
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
            <Button className="mt-4" onClick={() => setNewChatDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
