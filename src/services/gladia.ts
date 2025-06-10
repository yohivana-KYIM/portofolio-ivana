const GLADIA_API_KEY = '8846a1c0-8c84-4fe9-b7be-00a531a89fac';

export interface GladiaTranscriptionOptions {
  language?: string;
  detectLanguage?: boolean;
  translation?: boolean;
  targetLanguages?: string[];
  diarization?: boolean;
  numberOfSpeakers?: number;
  subtitles?: boolean;
  subtitlesFormat?: 'srt' | 'vtt';
}

export interface GladiaTranscriptionResult {
  transcription: string;
  translation?: string;
  language?: string;
  subtitles?: string;
  speakers?: Array<{
    id: number;
    text: string;
    start: number;
    end: number;
  }>;
}

export const transcribeAudio = async (
  audioBlob: Blob,
  options: GladiaTranscriptionOptions = {}
): Promise<GladiaTranscriptionResult> => {
  try {
    // Convert blob to base64
    const base64Audio = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.readAsDataURL(audioBlob);
    });

    // Prepare request body
    const requestBody = {
      audio_base64: base64Audio,
      language: options.language || 'auto',
      detect_language: options.detectLanguage ?? true,
      translation: options.translation ?? false,
      translation_config: options.translation ? {
        target_languages: options.targetLanguages || ['en'],
        model: 'base',
        match_original_utterances: true,
        lipsync: true
      } : undefined,
      diarization: options.diarization ?? false,
      diarization_config: options.diarization ? {
        number_of_speakers: options.numberOfSpeakers || 2,
        min_speakers: 1,
        max_speakers: options.numberOfSpeakers || 2,
        enhanced: false
      } : undefined,
      subtitles: options.subtitles ?? false,
      subtitles_config: options.subtitles ? {
        formats: [options.subtitlesFormat || 'srt'],
        minimum_duration: 1,
        maximum_duration: 15.5,
        maximum_characters_per_row: 42,
        maximum_rows_per_caption: 3,
        style: 'default'
      } : undefined
    };

    // Send transcription request
    const response = await fetch('https://api.gladia.io/v2/transcription', {
      method: 'POST',
      headers: {
        'x-gladia-key': GLADIA_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Gladia API error: ${response.status}`);
    }

    const data = await response.json();

    // Process the response
    const result: GladiaTranscriptionResult = {
      transcription: data.result.transcription.full_transcript,
      language: data.result.transcription.languages[0],
    };

    // Add translation if available
    if (data.result.translation?.results?.[0]?.full_transcript) {
      result.translation = data.result.translation.results[0].full_transcript;
    }

    // Add subtitles if available
    if (data.result.transcription.subtitles?.[0]?.subtitles) {
      result.subtitles = data.result.transcription.subtitles[0].subtitles;
    }

    // Add speaker information if diarization is enabled
    if (data.result.transcription.utterances) {
      result.speakers = data.result.transcription.utterances.map((u: any) => ({
        id: u.speaker,
        text: u.text,
        start: u.start,
        end: u.end
      }));
    }

    return result;
  } catch (error) {
    console.error('Error transcribing audio with Gladia:', error);
    throw error;
  }
};

// Fonction utilitaire pour formater les sous-titres
export const formatSubtitles = (subtitles: string): string => {
  return subtitles
    .split('\n\n')
    .map(block => {
      const lines = block.split('\n');
      if (lines.length >= 3) {
        const [index, time, ...text] = lines;
        return `${index}\n${time}\n${text.join(' ')}`;
      }
      return block;
    })
    .join('\n\n');
}; 