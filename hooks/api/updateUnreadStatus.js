import { useMutation } from '@tanstack/react-query';

const updateUnreadByPhoneNumber = async (phoneNumber)=>{
    console.log("phoneNumber. ", phoneNumber)
    const response = await fetch('https://api.bizwapp.com/api/auth/changeUnreadStatus',
        {
            method:"PUT",
            headers:{
                'Content-Type':"application/json"
            },
            credentials: "include",
            body:JSON.stringify({phoneNumber})
        }
    )

    if(!response.ok){
        throw new Error('failed to update unread. ')
    }

    return response.json;
}

const useUpdateUnread =()=>{
    return useMutation({
        mutationFn: updateUnreadByPhoneNumber
    })
}

export default useUpdateUnread;