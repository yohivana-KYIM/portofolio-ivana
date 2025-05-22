const WHATSAPP_TOKEN = 'EAASJDapzLzABO8ZBBWzJSz4yqKdbQ7NcynwImSCFu9nR3PcKSz3txjGngjCgzI1QsSZC7nfQWSnwJUHY9Mvm7C6NDyraYV2FEeMBZBGhdLPBxFuA4XZCnrJs8AM52ZBbxkMJytZAnkZCS4c8GWI8B1n1Sw7V25HabfP8PTRBWuQo7FfecCpReS4cq7s8LLjgTuzhnpk80dUg1X3ZCuGBriaSyxhrpNkZD';
const PHONE_NUMBER_ID = '697511780106937';
const WHATSAPP_BUSINESS_ID = '1038065651154609';

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template';
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
  };
}

export const sendWhatsAppMessage = async (message: WhatsAppMessage) => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          ...message,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}; 