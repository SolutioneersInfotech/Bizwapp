import { useMutation } from "@tanstack/react-query";

const API_URL = "https://graph.facebook.com/v18.0/28995967470047562/message_templates";
const ACCESS_TOKEN = "EAAJdfKsroxoBO39zxdb5Ge9l0qTYXmUZCQn7J3ZBb5YbVZAfZAvu3N2P5GKjZCsF4zoEmhYM77Aovj2yzbj70revHFc1ESQSZCEOUWWN9N3u0fE7Wrpc63Lrx7fHzZCpoPSNo6zru2CkNx7iITnIlZBV4diOy73ijROalTu5mVlK8BTB7ewob4nUIFc6"

interface TemplateData {
    name: string;
    category: "MARKETING" | "TRANSACTIONAL" | "UTILITY"; // Adjust categories as needed
    language: string;
    components: {
      type: "HEADER" | "BODY" | "FOOTER";
      format?: "IMAGE" | "TEXT"; // HEADER requires format
      text: string;
    }[];
  }


  const useSendTemplateMutation = () => {
    return useMutation({
      mutationFn: async (jsonInput: TemplateData) => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(JSON.parse(jsonInput))
      });

      console.log("response.",response)
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to send template");
      }
  
      return response.json();
    }
    });
  };
  
  export { useSendTemplateMutation };


