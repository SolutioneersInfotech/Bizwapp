import { useQuery } from "@tanstack/react-query";

const fetchMessageHistory = async ({ queryKey }) => {
  const [,userId ,  phoneNumber] = queryKey;

  const response = await fetch(`https://api.bizwapp.com/api/auth/gettingConversations/${userId}/${phoneNumber}`, {
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

const useMessageHistory = (userId , phoneNumber) => {
  return useQuery({
    queryKey: ["messageHistory", userId, phoneNumber], // ✅ userId bhi add karo
    queryFn: fetchMessageHistory,
    enabled: !!userId && !!phoneNumber, // ✅ Dono required hain
    staleTime: 0,
  });
};

export default useMessageHistory;
