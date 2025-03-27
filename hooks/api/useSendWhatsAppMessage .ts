import { useMutation, UseMutationResult } from '@tanstack/react-query';

interface SendMessageParams {
  phoneNumbers: string[];  // phoneNumbers as an array of strings
  message: string;
}

const useSendWhatsAppMessage = () => {
  return useMutation<any, Error, SendMessageParams>({
    mutationFn:async ({ phoneNumbers, message }: SendMessageParams) => {
      console.log('Sending message...', { phoneNumbers, message });
      const response = await fetch('http://localhost:5001/api/auth/SendingBulkContacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumbers, message }),
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
