const WHATSAPP_TOKEN = 'EAASJDapzLzABO2ZAiJKYf5gVbVeGmwfdY7xA0N4SiJPZBZC0mhKIGIQi21F1qj2XZCjW5qAUZBp19PKZCdZApYMGZAHmtZAs8qPff8jeVVJ3Iwlq91ZAgog1rT00xatpSTG7vaFAZCJgFonb2auyHUe9VG95mcbgZBNKjphwnRUkPzbeZAIAc7wXhiBgH9HgVlUxAPGOAHo8bdxixUcqXMyJ7vhBiTGNbijAZD';
const PHONE_NUMBER_ID = '697511780106937';

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