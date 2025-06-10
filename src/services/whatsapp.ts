// @ts-nocheck
import type { GladiaTranscriptionOptions } from './gladia';
import { transcribeAudio } from './gladia';

const WHATSAPP_TOKEN = 'EAASJDapzLzABO9kLLsH0XYtJjMZBWrBhLs0UsNPm6CZBplEz8OYSWKz3sly6CybeGDkmIamEEZAT12qQ4rOMQT2hew5WZCzQYu5bOyH5uCIqF7FCjZClaKQYb3N01Db7agbOlu7PE0UP6xI7S9hJ3C3ZCAXcMGINyP2HAtL4JoetU1lJ9n7ZBFTwxOygq0Az3WJOZB4F6s4JDKyeF7MaWjMZBxINRU8wZD';
const PHONE_NUMBER_ID = '697511780106937';
const WHATSAPP_BUSINESS_ID = '1038065651154609';

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template' | 'audio';
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
  };
  audio?: {
    id?: string;
    link?: string;
    caption?: string;
  };
}

export interface VoiceMessageOptions extends GladiaTranscriptionOptions {
  includeTranscription?: boolean;
  includeTranslation?: boolean;
  includeSubtitles?: boolean;
  includeSpeakers?: boolean;
}

export const sendWhatsAppMessage = async (message: WhatsAppMessage) => {
  try {
    // Format the phone number to ensure it's in the correct format
    const formattedPhone = message.to.replace(/\D/g, '');

    const requestBody = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: message.type,
    };

    // Add the appropriate content based on message type
    if (message.type === 'text' && message.text) {
      requestBody.text = message.text;
    } else if (message.type === 'template' && message.template) {
      requestBody.template = message.template;
    } else if (message.type === 'audio' && message.audio) {
      requestBody.audio = message.audio;
    }

    console.log('Sending WhatsApp message:', requestBody);

    const response = await fetch(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('WhatsApp API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        requestBody
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
};

export const uploadAudioToWhatsApp = async (
  audioBlob: Blob, 
  options: VoiceMessageOptions = {}
): Promise<{
  messageId: string;
  transcription?: string;
  translation?: string;
  subtitles?: string;
  speakers?: Array<{
    id: number;
    text: string;
    start: number;
    end: number;
  }>;
}> => {
  try {
    // First, upload the audio file to get a media ID
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('type', 'audio/webm');
    formData.append('messaging_product', 'whatsapp');

    const uploadResponse = await fetch(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/media`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        },
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json().catch(() => null);
      console.error('WhatsApp Upload Error:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        error: errorData
      });
      throw new Error(`Error uploading audio: ${uploadResponse.status}`);
    }

    const { id: mediaId } = await uploadResponse.json();

    // Get transcription and translation using Gladia
    let transcription: string | undefined;
    let translation: string | undefined;
    let subtitles: string | undefined;
    let speakers: Array<{ id: number; text: string; start: number; end: number; }> | undefined;
    let caption: string | undefined;

    if (options.includeTranscription || options.includeTranslation || options.includeSubtitles || options.includeSpeakers) {
      const gladiaResult = await transcribeAudio(audioBlob, {
        language: options.language,
        detectLanguage: options.detectLanguage,
        translation: options.includeTranslation,
        targetLanguages: options.targetLanguages,
        diarization: options.includeSpeakers,
        numberOfSpeakers: options.numberOfSpeakers,
        subtitles: options.includeSubtitles,
        subtitlesFormat: options.subtitlesFormat
      });

      transcription = gladiaResult.transcription;
      translation = gladiaResult.translation;
      subtitles = gladiaResult.subtitles;
      speakers = gladiaResult.speakers;

      // Prepare caption with available information
      const captionParts = [];
      if (transcription) captionParts.push(`Transcription: ${transcription}`);
      if (translation) captionParts.push(`Traduction: ${translation}`);
      if (speakers) {
        const speakersText = speakers
          .map(s => `Speaker ${s.id}: ${s.text}`)
          .join('\n');
        captionParts.push(`Intervenants:\n${speakersText}`);
      }
      caption = captionParts.join('\n\n');
    }

    // Then send the audio message
    const messageResponse = await sendWhatsAppMessage({
      to: "237671178991",
      type: "audio",
      audio: {
        id: mediaId,
        caption: caption,
      },
    });

    return {
      messageId: messageResponse.id,
      transcription,
      translation,
      subtitles,
      speakers
    };
  } catch (error) {
    console.error('Error uploading audio to WhatsApp:', error);
    throw error;
  }
}; 