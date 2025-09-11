"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Spinner } from "../components/ui/spinner"; // Replace with your actual Spinner import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
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
  Archive,
  Trash2,
  Bell,
  BellOff,
  UserPlus,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useUpdateUnread from "@/hooks/api/updateUnreadStatus";
import type { Contact, Message } from "@/lib/types";
import useMessageHistory from "@/hooks/api/getMessageHistory";

interface Conversation {
  _id: string;
  phoneNumber: string;
  name: string;
  unread?: boolean;
}

interface ConversationListProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  loading: boolean;
  conversationHistory: Conversation[];
  selectedContact: Conversation | null;
  selectedContacts: string[];
  uniqueConversations: Conversation[];
  bulkMessageOpen: boolean;
  toggleContactSelection: (phone: string) => void;
  handleContactSelect: (
    conversation: Conversation,
    phone: string,
    name: string
  ) => void;
  handleArchiveConversation: (conversation: Conversation) => void;
  handleDeleteConversation: (conversation: Conversation) => void;
  handleMuteConversation: (conversation: Conversation) => void;
  setNewChatDialogOpen: (open: boolean) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  isMobile,
  setMobileView,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  loading,
  conversationHistory,
  selectedContact,
  setSelectedPhone,
  setSelectedContact,
  selectedContacts,
  uniqueConversations,
  bulkMessageOpen,
  toggleContactSelection,
  // handleContactSelect,
  handleArchiveConversation,
  handleDeleteConversation,
  handleMuteConversation,
  setNewChatDialogOpen,
}) => {
  const [selectedName, setSelectedName] = useState<String | null>(null);

  const { mutate: unreadStatus } = useUpdateUnread();

  // useEffect(() => {
  //   if (currentContact && !selectedContact) {
  //     setSelectedContact(currentContact);
  //   }
  // }, [currentContact, selectedContact]);

  const handleContactSelect = (contact: Contact, phone, name) => {
    if (isMobile) setMobileView("chat");

    unreadStatus(phone);
    setSelectedName(name);
    setSelectedContact(contact);
    // setCurrentContact(contact);
    setSelectedPhone(phone);
  };

  return (
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

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="px-4"
      >
        <TabsList className="w-full mt-4">
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
          className="mt-4 space-y-2 max-h-[calc(100vh-130px)] overflow-y-auto  md:max-h-[500px] scrollbar-thin"
        >
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size={40} className="text-green-600" />
            </div>
          ) : (uniqueConversations?.length ?? 0) === 0 ? (
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
                key={conversation._id}
                className={conversation.unread ? "font-bold" : "font-light"}
              >
                <ConversationItem
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
  );
};

export default ConversationList;

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
          <p className="font-medium truncate">
            {conversation.name ? conversation.name : conversation.phoneNumber}
          </p>
          {!conversation.unread > 0 && (
            <p className="text-xs text-muted-foreground">
              {new Date(conversation.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {conversation.lastMessage}
        </p>
      </div>
      {conversation.unread > 0 && (
        <Badge className="ml-auto bg-primary text-primary-foreground">
          New
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
