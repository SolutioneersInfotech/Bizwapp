import { useQuery } from "@tanstack/react-query";

const API_URL = "https://bizwapp-backend-production-2354.up.railway.app/api/auth/getAllTemplates";
// const API_URL = "https://bizwapp-backend-production-2354.up.railway.app/api/auth/get-twilio-template";

const fetchTemplates = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch WhatsApp templates");
  }
  return response.json();
};

export const useWhatsAppTemplates = () => {
  return useQuery({
    queryKey: ["whatsappTemplates"],
    queryFn: fetchTemplates,
  });
};
