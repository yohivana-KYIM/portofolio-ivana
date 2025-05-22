import { WhatsAppMessage } from './whatsapp';

interface WebhookEvent {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
        messages: Array<{
          from: string;
          id: string;
          timestamp: string;
          text: {
            body: string;
          };
          type: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

export const handleWebhook = async (event: WebhookEvent) => {
  try {
    // Verify if it's a WhatsApp message
    if (event.object !== 'whatsapp_business_account') {
      return { status: 'error', message: 'Invalid webhook object' };
    }

    // Process each entry
    for (const entry of event.entry) {
      for (const change of entry.changes) {
        if (change.field === 'messages') {
          const value = change.value;
          
          // Process each message
          for (const message of value.messages) {
            if (message.type === 'text') {
              // Here you would typically:
              // 1. Store the message in your database
              // 2. Update your chat UI
              // 3. Trigger any necessary notifications
              
              console.log('Received WhatsApp message:', {
                from: message.from,
                text: message.text.body,
                timestamp: message.timestamp
              });
            }
          }
        }
      }
    }

    return { status: 'success' };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return { status: 'error', message: 'Error processing webhook' };
  }
};

// Function to verify webhook signature
export const verifyWebhookSignature = (signature: string, body: string) => {
  // Implement signature verification logic here
  // This is important for security
  return true; // Placeholder
}; 