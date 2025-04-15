import { useMutation } from '@tanstack/react-query';

const updateUnreadByPhoneNumber = async (phoneNumber)=>{
    console.log("phoneNumber. ", phoneNumber)
    const response = await fetch('https://bizwapp-back-end-khaki.vercel.app/api/auth/changeUnreadStatus',
        {
            method:"PUT",
            headers:{
                'Content-Type':"application/json"
            },
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