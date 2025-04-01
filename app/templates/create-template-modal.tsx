"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';




interface TemplateComponent {
  type: string;
  format?: string;
  text?: string;
  buttons?: {
    type: string;
    text: string;
  }[];
}

interface TemplateData {
  name: string;
  category: string;
  language: string;
  components: TemplateComponent[];
}

const defaultTemplate: TemplateData = {
  "name": "orderdate",
  "category": "UTILITY",
  "language": "en",
  "components": [
    {
      "type": "HEADER",
      "format": "TEXT",
      "text": "Order Update"
    },
    {
      "type": "BODY",
      "text": "Hello Abhi, your order macbook has been shipped! 🚚"
    },
    {
      "type": "FOOTER",
      "text": "Thank you for shopping with us!"
    },
    {
      "type": "BUTTONS",
      "buttons": [
        {
          "type": "QUICK_REPLY",
          "text": "Track Order"
        },
        {
          "type": "QUICK_REPLY",
          "text": "Contact Support"
        }
      ]
    }
  ]
}

interface CreateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (template: TemplateData) => void;
}

export default function CreateTemplateModal({
  open,
  onOpenChange,
  onSubmit,
}: CreateTemplateModalProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "json">("visual");
  const [template, setTemplate] = useState<TemplateData>({ ...defaultTemplate });
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify(defaultTemplate, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  const updateTemplate = (updatedTemplate: TemplateData) => {
    setTemplate(updatedTemplate);
    setJsonInput(JSON.stringify(updatedTemplate, null, 2));
  };




  const handleJsonChange = (value: string) => {
    setJsonInput(value);
    try {
      const parsed = JSON.parse(value);
      setTemplate(parsed);
      setJsonError(null);
    } catch (error) {
      setJsonError("Invalid JSON format");
    }
  };

  const handleSubmit = (jsonInput) => {
    console.log("jsonInput", jsonInput)
    mutate(jsonInput, {
      onSuccess: (response) => {
        if (response.status === "APPROVED") {
          toast.success(`✅ Your submitted Template is ${response.status}`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
        else {
          toast.error(`ℹ️ Template status: ${response.status}`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }


      },
      onError: (err) => {
        console.error("Error submitting template:", err);
    
        // Extract error message from the response
        const errorTitle = err?.response?.data?.error?.error_user_title || "Error";
    const errorMessage =
      err?.response?.data?.error?.error_user_msg ||
      err?.response?.data?.error?.message ||
      err?.message ||
      "Something went wrong!";

    // Show error toast with both title and message
    toast.error(`❌ ${errorTitle}: ${errorMessage}`, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
      },
    });
    onSubmit(template);
    onOpenChange(false);
  };

  const addButton = (componentIndex: number) => {
    const updatedTemplate = { ...template };
    const component = updatedTemplate.components[componentIndex];

    if (!component.buttons) {
      component.buttons = [];
    }

    component.buttons.push({
      type: "QUICK_REPLY",
      text: "",
    });

    updateTemplate(updatedTemplate);
  };

  const updateButton = (componentIndex: number, buttonIndex: number, text: string) => {
    const updatedTemplate = { ...template };
    if (updatedTemplate.components[componentIndex].buttons) {
      updatedTemplate.components[componentIndex].buttons![buttonIndex].text = text;
      updateTemplate(updatedTemplate);
    }
  };

  const removeButton = (componentIndex: number, buttonIndex: number) => {
    const updatedTemplate = { ...template };
    if (updatedTemplate.components[componentIndex].buttons) {
      updatedTemplate.components[componentIndex].buttons!.splice(buttonIndex, 1);
      updateTemplate(updatedTemplate);
    }
  };

  const addButtonsComponent = () => {
    const updatedTemplate = { ...template };
    // Check if BUTTONS component already exists
    const hasButtonsComponent = updatedTemplate.components.some(
      (comp) => comp.type === "BUTTONS"
    );

    if (!hasButtonsComponent) {
      updatedTemplate.components.push({
        type: "BUTTONS",
        buttons: [
          {
            type: "QUICK_REPLY",
            text: "",
          },
        ],
      });
      updateTemplate(updatedTemplate);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
          <DialogDescription>
            Create a new WhatsApp message template for your business.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "visual" | "json")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visual">Visual Editor</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  value={template.name}
                  onChange={(e) =>
                    updateTemplate({ ...template, name: e.target.value })
                  }
                  placeholder="template_name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="language" className="text-sm font-medium">
                  Language
                </label>
                <Select
                  value={template.language}
                  onValueChange={(value) =>
                    updateTemplate({ ...template, language: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select
                value={template.category}
                onValueChange={(value) =>
                  updateTemplate({ ...template, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTILITY">Utility</SelectItem>
                  <SelectItem value="MARKETING">Marketing</SelectItem>
                  <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-medium">Components</h3>

              {template.components.map((component, index) => (
                <div key={index} className="border rounded-md p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{component.type}</h4>
                  </div>

                  {component.type === "HEADER" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Format</label>
                      <Select
                        value={component.format || "TEXT"}
                        onValueChange={(value) => {
                          const updatedTemplate = { ...template };
                          updatedTemplate.components[index].format = value;
                          updateTemplate(updatedTemplate);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TEXT">Text</SelectItem>
                          <SelectItem value="IMAGE">Image</SelectItem>
                          <SelectItem value="VIDEO">Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {(component.type === "HEADER" ||
                    component.type === "BODY" ||
                    component.type === "FOOTER") && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Text</label>
                        <Textarea
                          value={component.text || ""}
                          onChange={(e) => {
                            const updatedTemplate = { ...template };
                            updatedTemplate.components[index].text = e.target.value;
                            updateTemplate(updatedTemplate);
                          }}
                          placeholder={`Enter ${component.type.toLowerCase()} text`}
                          rows={component.type === "BODY" ? 4 : 2}
                        />
                        {component.type === "BODY" && (
                          <p className="text-xs text-muted-foreground">
                            Use &#123;&#123;1&#125;&#125;, &#123;&#123;2&#125;&#125; for variables
                          </p>
                        )}
                      </div>
                    )}
                  {/* <ToastContainer
                  position="bottom-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick={false}
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                   /> */}
                  {component.type === "BUTTONS" && (
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Buttons</label>
                      {component.buttons?.map((button, buttonIndex) => (
                        <div
                          key={buttonIndex}
                          className="flex items-center gap-2"
                        >
                          <Input
                            value={button.text}
                            onChange={(e) =>
                              updateButton(index, buttonIndex, e.target.value)
                            }
                            placeholder="Button text"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeButton(index, buttonIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {(component.buttons?.length || 0) < 3 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => addButton(index)}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Button
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {!template.components.some((c) => c.type === "BUTTONS") && (
                <Button
                  variant="outline"
                  onClick={addButtonsComponent}
                  className="w-full"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Buttons Component
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="json" className="space-y-4 mt-4">
            <Textarea
              value={jsonInput}
              onChange={(e) => handleJsonChange(e.target.value)}
              className="font-mono text-sm"
              rows={20}
            />
            {jsonError && (
              <p className="text-sm text-destructive">{jsonError}</p>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleSubmit(jsonInput)}>Create Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}