import { useMutation, UseMutationResult } from '@tanstack/react-query';

type SendMessageParams = {
  contacts: {
    phoneNumber: string;
    name: string;
  }[];
  message: string;
};

const useSendWhatsAppMessage = () => {
  return useMutation<any, Error, SendMessageParams>({
    mutationFn:async ({ contacts, message }: SendMessageParams) => {
      console.log('Sending message...', { contacts, message });
      const response = await fetch('https://bizwapp-back-end-khaki.vercel.app/api/auth/SendingBulkContacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contacts, message }),
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
