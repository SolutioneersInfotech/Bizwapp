import { useMutation } from "@tanstack/react-query";
 
 const usePostData = (url, headers = { "Content-Type": "application/json" }) => {
 
   return useMutation({
     mutationFn: async (formData) => {
       console.log("Mutation function called with:", formData);
 
       const response = await fetch(url, {
         method: "POST",
         headers,
         body: JSON.stringify(formData),
         credentials: "include",
       });
 
       if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.message || "Failed to submit data");
       }
 
       return response.json();
     },
   });
 };
 
 export default usePostData;