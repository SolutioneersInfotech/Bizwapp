import { useQuery } from "@tanstack/react-query";

const getAllConversation = async()=>{
    const response = await fetch('https://bizwapp-back-end-khaki.vercel.app/api/auth/conversationHistory')
    if(!response.ok){
        throw new Error('Failed to get Conversation.')
    }

    return response.json();
}

const useGetAllConversation =()=>{
    return useQuery({
        queryKey:["conversation"],
        queryFn:getAllConversation
    })
}

export default useGetAllConversation;