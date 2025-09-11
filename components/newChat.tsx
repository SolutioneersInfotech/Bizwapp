"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  message: string;
  onMessageChange: (value: string) => void;
  onSubmit: () => void;
}

const NewChatDialog: React.FC<NewChatDialogProps> = ({
  open,
  onOpenChange,
  phone,
  onPhoneChange,
  message,
  onMessageChange,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Chat</DialogTitle>
          <DialogDescription>
            Enter a phone number to start a new conversation
          </DialogDescription>
        </DialogHeader>

        {/* Warning Message */}
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2 mb-2">
          ⚠️ Note: Until the recipient initiates a conversation, only approved
          templates can be sent. Free-form messages are restricted by Meta
          policy.
        </p>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="Enter phone number with country code"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Include country code, e.g., +1234567890
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="initial-message">Initial Message (Optional)</Label>
            <Textarea
              id="initial-message"
              placeholder="Type your first message..."
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Start Chat</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog;
