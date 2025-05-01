import { useQuery } from "@tanstack/react-query";

const fetchMessageHistory = async ({ queryKey }) => {
  const [, phoneNumber] = queryKey;

  const response = await fetch(`https://api.bizwapp.com/api/auth/gettingConversations/${phoneNumber}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch message history");
  } 

  return response.json();
};

const useMessageHistory = (phoneNumber) => {
  return useQuery({
    queryKey: ["messageHistory", phoneNumber],
    queryFn: fetchMessageHistory,
    enabled: !!phoneNumber, // optional: only run if phoneNumber is available
    staleTime: 0,
  });
};

export default useMessageHistory;
