import { useQuery } from "@tanstack/react-query";

const API_URL = "https://graph.facebook.com/v18.0/28995967470047562/message_templates";
const ACCESS_TOKEN = "EAAJdfKsroxoBO39zxdb5Ge9l0qTYXmUZCQn7J3ZBb5YbVZAfZAvu3N2P5GKjZCsF4zoEmhYM77Aovj2yzbj70revHFc1ESQSZCEOUWWN9N3u0fE7Wrpc63Lrx7fHzZCpoPSNo6zru2CkNx7iITnIlZBV4diOy73ijROalTu5mVlK8BTB7ewob4nUIFc6"; // Store in .env file

const fetchTemplates = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
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
