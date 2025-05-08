import { useQuery } from "@tanstack/react-query";

const getAllConversation = async(userId)=>{

    const response = await fetch(`https://api.bizwapp.com/api/auth/conversationHistory/${userId}`)
    if(!response.ok){
        throw new Error('Failed to get Conversation.')
    }

    return response.json();
}

const useGetAllConversation =(userId)=>{
    return useQuery({
        queryKey:["conversation" , userId],
        queryFn: () => getAllConversation(userId),
    })
}

export default useGetAllConversation;