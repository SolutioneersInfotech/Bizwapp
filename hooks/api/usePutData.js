import { useMutation, useQueryClient } from "@tanstack/react-query";

const usePutData= async ({id , updatedData  })=>{
    console.log("Sending PUT request to update contact:", id, updatedData);
    const response = await fetch(`http://localhost:5001/api/auth/updateContact/${id}`,{
        method:'PUT',
        headers:{
            "Content-Type" :'application/json'
            },
        body: JSON.stringify(updatedData)
        });
        
        if(!response.ok){
            throw new Error("Failed to update data.") 
        }
        return response.json()
};


    const useUpdateContact = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: usePutData,
      onSuccess: () => {
        queryClient.invalidateQueries(["contacts"]); // Refresh contacts list
      },
    });
  };

export default useUpdateContact;


