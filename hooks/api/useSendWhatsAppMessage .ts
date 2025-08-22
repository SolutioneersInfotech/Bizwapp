import { useMutation, UseMutationResult } from '@tanstack/react-query';

type SendMessageParams = {
  userId: string;
  contacts: {
    phoneNumber: string;
    name: string;
  }[];
  message: string;
};

const useSendWhatsAppMessage = () => {
  return useMutation<any, Error, SendMessageParams>({
    mutationFn:async ({ contacts, message , userId }: SendMessageParams) => {
      console.log('Sending message...', { contacts, message , userId });
      const response = await fetch('https://api.bizwapp.com/api/auth/SendingBulkContacts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ contacts, message , userId}),
      });

      if (!response.ok) {
        throw new Error('Error sending WhatsApp message');
      }

      const data = await response.json();
      return data;
    },
});
};

export default useSendWhatsAppMessage;
