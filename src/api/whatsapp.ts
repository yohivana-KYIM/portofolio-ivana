import { NextApiRequest, NextApiResponse } from 'next';
import { verifyWebhookSignature } from '../../services/whatsappWebhook';
import { getWebSocketServer } from '../../server/websocket';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Vérification du webhook
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.status(403).send('Forbidden');
    }
  } else if (req.method === 'POST') {
    try {
      // Vérifier la signature du webhook
      const isValid = verifyWebhookSignature(req);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      const { entry } = req.body;
      const webSocketServer = getWebSocketServer();

      for (const entryItem of entry) {
        for (const change of entryItem.changes) {
          if (change.value.messages) {
            for (const message of change.value.messages) {
              // Diffuser le message via WebSocket
              webSocketServer.broadcastWhatsAppMessage({
                from: message.from,
                body: message.text.body,
                timestamp: message.timestamp
              });
            }
          }
        }
      }

      res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Function to subscribe to webhooks
export const subscribeToWebhooks = async () => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v22.0/697511780106937/subscribed_apps`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error subscribing to webhooks:', error);
    throw error;
  }
}; 