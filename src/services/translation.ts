const GOOGLE_TRANSLATE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;

export interface TranslationOptions {
  sourceLanguage?: string;
  targetLanguage: string;
}

export const translateText = async (
  text: string,
  options: TranslationOptions
): Promise<string> => {
  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: options.sourceLanguage || 'auto',
          target: options.targetLanguage,
          format: 'text',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
};

// Langues supportées par Google Translate
export const SUPPORTED_LANGUAGES = {
  'fr': 'Français',
  'en': 'Anglais',
  'es': 'Espagnol',
  'de': 'Allemand',
  'it': 'Italien',
  'pt': 'Portugais',
  'ru': 'Russe',
  'ja': 'Japonais',
  'ko': 'Coréen',
  'zh': 'Chinois',
  'ar': 'Arabe',
  'hi': 'Hindi',
  'bn': 'Bengali',
  'nl': 'Néerlandais',
  'pl': 'Polonais',
  'tr': 'Turc',
  'vi': 'Vietnamien',
  'th': 'Thaï',
  'id': 'Indonésien',
  'ms': 'Malais',
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES; 