import { WebSocketServer } from 'ws';
import { Server } from 'http';
import { verifyWebhookSignature } from '../services/whatsappWebhook';

interface WhatsAppMessage {
  from: string;
  body: string;
  timestamp: string;
}

export function setupWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server });
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    console.log('Nouveau client WebSocket connecté');
    clients.add(ws);

    ws.on('close', () => {
      console.log('Client WebSocket déconnecté');
      clients.delete(ws);
    });
  });

  // Fonction pour diffuser les messages WhatsApp à tous les clients connectés
  function broadcastWhatsAppMessage(message: WhatsAppMessage) {
    const messageData = {
      type: 'whatsapp_message',
      message: message.body,
      timestamp: message.timestamp,
      from: message.from
    };

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(messageData));
      }
    });
  }

  // Exposer la fonction de diffusion pour l'utiliser dans le webhook
  return {
    broadcastWhatsAppMessage
  };
} 