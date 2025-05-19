// import { useMutation } from "@tanstack/react-query";

// const sendWhatsAppImage = async ({ phone, imageUrl }) => {
//   const response = await fetch("http://localhost:5001/send-image-whatsapp", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ phone, imageUrl })
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data?.error || "Failed to send WhatsApp image.");
//   }

//   return data;
// };

// const useSendWhatsAppImage = () => {
//   return useMutation({
//     mutationFn: sendWhatsAppImage
//   });
// };

// export default useSendWhatsAppImage;
