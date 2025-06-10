import React, { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, Send } from 'lucide-react';
import { AudioRecorder } from '../services/audioRecorder';
import { uploadAudioToWhatsApp } from '../services/whatsapp';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../services/translation';

interface VoiceRecorderProps {
  maxDuration?: number; // in seconds
  onTranscriptionComplete?: (text: string) => void;
  onTranslationComplete?: (text: string) => void;
  onSubtitlesComplete?: (text: string) => void;
  onSpeakersComplete?: (speakers: Array<{ id: number; text: string; start: number; end: number; }>) => void;
  targetLanguage?: SupportedLanguage;
  includeTranscription?: boolean;
  includeTranslation?: boolean;
  includeSubtitles?: boolean;
  includeSpeakers?: boolean;
  numberOfSpeakers?: number;
  subtitlesFormat?: 'srt' | 'vtt';
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  maxDuration = 300, // 5 minutes par défaut
  onTranscriptionComplete,
  onTranslationComplete,
  onSubtitlesComplete,
  onSpeakersComplete,
  targetLanguage = 'fr',
  includeTranscription = true,
  includeTranslation = true,
  includeSubtitles = false,
  includeSpeakers = false,
  numberOfSpeakers = 2,
  subtitlesFormat = 'srt'
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  const [subtitles, setSubtitles] = useState<string>('');
  const [speakers, setSpeakers] = useState<Array<{ id: number; text: string; start: number; end: number; }>>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, maxDuration]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      recorderRef.current = new AudioRecorder(maxDuration);
      await recorderRef.current.startRecording();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;

    try {
      setIsProcessing(true);
      const audioBlob = await recorderRef.current.stopRecording();
      setIsRecording(false);

      // Upload to WhatsApp with transcription and translation
      const result = await uploadAudioToWhatsApp(audioBlob, {
        language: targetLanguage,
        detectLanguage: true,
        translation: includeTranslation,
        targetLanguages: [targetLanguage],
        diarization: includeSpeakers,
        numberOfSpeakers,
        subtitles: includeSubtitles,
        subtitlesFormat,
        includeTranscription,
        includeTranslation,
        includeSubtitles,
        includeSpeakers
      });
      
      if (result.transcription) {
        setTranscription(result.transcription);
        onTranscriptionComplete?.(result.transcription);
      }

      if (result.translation) {
        setTranslation(result.translation);
        onTranslationComplete?.(result.translation);
      }

      if (result.subtitles) {
        setSubtitles(result.subtitles);
        onSubtitlesComplete?.(result.subtitles);
      }

      if (result.speakers) {
        setSpeakers(result.speakers);
        onSpeakersComplete?.(result.speakers);
      }
    } catch (error) {
      console.error('Error processing recording:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="p-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              disabled={isProcessing}
            >
              <Mic size={24} />
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              disabled={isProcessing}
            >
              <StopCircle size={24} />
            </button>
          )}
        </div>
        
        {isRecording && (
          <div className="flex flex-col items-center gap-2">
            <div className="text-lg font-semibold text-purple-600">
              {formatTime(recordingTime)} / {formatTime(maxDuration)}
            </div>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 transition-all duration-1000"
                style={{ width: `${(recordingTime / maxDuration) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {isProcessing && (
        <div className="text-gray-600 dark:text-gray-400">
          Traitement en cours...
        </div>
      )}

      {transcription && includeTranscription && (
        <div className="w-full max-w-md p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Transcription :</h3>
          <p className="text-gray-700 dark:text-gray-300">{transcription}</p>
        </div>
      )}

      {translation && includeTranslation && (
        <div className="w-full max-w-md p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            Traduction ({SUPPORTED_LANGUAGES[targetLanguage]}) :
          </h3>
          <p className="text-gray-700 dark:text-gray-300">{translation}</p>
        </div>
      )}

      {subtitles && includeSubtitles && (
        <div className="w-full max-w-md p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Sous-titres :</h3>
          <pre className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono text-sm">
            {subtitles}
          </pre>
        </div>
      )}

      {speakers && includeSpeakers && speakers.length > 0 && (
        <div className="w-full max-w-md p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Intervenants :</h3>
          <div className="space-y-2">
            {speakers.map((speaker, index) => (
              <div key={index} className="p-2 bg-gray-100 dark:bg-gray-600 rounded">
                <div className="font-semibold text-purple-600 dark:text-purple-400">
                  Intervenant {speaker.id}
                </div>
                <div className="text-gray-700 dark:text-gray-300">{speaker.text}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatTime(speaker.start)} - {formatTime(speaker.end)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 