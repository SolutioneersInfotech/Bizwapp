import { useMutation } from "@tanstack/react-query";

const API_URL = "https://graph.facebook.com/v18.0/1150758433763562/message_templates";

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
    const accessToken = "EAAJvJ82giYwBPKSZARxHyywLiY8IKsiS55e8ZA5tzpRstmYeBn6PC2QWnqxtxev2HtxmbK6k26ZC20uPfnKLCd0aVXy1TJQ3TVs26H4VLb7zE5PnDOmdYsxCMSFQ3GaXvoRL2UyQQEMoGZCbnTIaccGSZAyZCghlzZCrZBuxkRoKZBynLGOmmfFISNPb00OLqX6siyBtTPekx77DiZCatsuKlBmAreRkwKPvbPTcRXmuWhqKpQowZDZD";
    return useMutation({
      mutationFn: async (jsonInput: TemplateData) => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(JSON.parse(jsonInput))
      });

      console.log("response.",response)
  
      const responseData = await response.json();

      if (!response.ok) {
        // ✅ Instead of throwing just the message, throw the full object
        throw {
          name: "ApiError",
          message: responseData?.error?.message || "Request failed",
          response: {
            data: responseData,
            status: response.status,
          },
        };
      }

      return responseData;
    }
    });
  };
  
  export { useSendTemplateMutation };


