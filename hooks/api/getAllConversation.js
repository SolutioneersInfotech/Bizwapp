import { useQuery } from "@tanstack/react-query";

const getAllConversation = async()=>{

    const userData = JSON.parse(localStorage.getItem('user'));
  console.log("userIdgggg", userData.user._id);
  const userId = userData?.user?._id;

    const response = await fetch(`https://api.bizwapp.com/api/auth/conversationHistory/${userId}`)
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