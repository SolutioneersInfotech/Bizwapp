import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ContactFormProps {
  title?: string;
  description?: string;
  contactData: { name: string; phone: string; email?: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ 
  title = "Add New Contact",
  description = "Enter the details of the new contact.",
  contactData,
  onChange,
  onSubmit,
  onClose
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter contact name"
              value={contactData.name}
              onChange={onChange}
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
              value={contactData.phone}
              onChange={onChange}
              required
            />
            <p className="text-xs text-muted-foreground">
              Include country code, e.g., +1 (555) 123-4567
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address (optional)"
              value={contactData.email || ""}
              onChange={onChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Contact</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ContactForm;
