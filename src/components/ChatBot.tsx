import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Mic, Square, Loader2, Phone } from 'lucide-react';
import { sendWhatsAppMessage } from '../services/whatsapp';
import { toast } from 'sonner';

// Définir les types pour la reconnaissance vocale
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'voice';
  audioUrl?: string;
  transcribedText?: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Bonjour! Je suis l'assistant virtuel d'Ivana. Comment puis-je vous aider aujourd'hui?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [connectionStatus] = useState<'connected'>('connected');
  const [lastSeen] = useState<Date>(new Date());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await sendVoiceMessage(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de l\'accès au microphone:', error);
      toast.error('Impossible d\'accéder au microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'fr-FR';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        let finalTranscript = '';

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          finalTranscript = transcript;
        };

        recognition.onerror = (event) => {
          console.error('Erreur de reconnaissance vocale:', event.error);
          reject(new Error(`Erreur de reconnaissance vocale: ${event.error}`));
        };

        recognition.onend = () => {
          if (finalTranscript) {
            resolve(finalTranscript);
          } else {
            reject(new Error('Aucun texte reconnu'));
          }
        };

        // Convertir le Blob en URL et le lire
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          recognition.stop();
        };

        // Démarrer la reconnaissance vocale et jouer l'audio
        recognition.start();
        audio.play();
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la reconnaissance vocale:', error);
        reject(error);
      }
    });
  };

  const sendVoiceMessage = async (audioBlob: Blob) => {
    setIsTyping(true);
    setIsTranscribing(true);
    try {
      // Transcrire l'audio en texte
      let transcribedText = '';
      try {
        transcribedText = await transcribeAudio(audioBlob);
        if (!transcribedText.trim()) {
          throw new Error('Texte vide');
        }
      } catch (error) {
        console.error('Erreur de transcription:', error);
        // Réessayer une fois en cas d'échec
        try {
          transcribedText = await transcribeAudio(audioBlob);
          if (!transcribedText.trim()) {
            throw new Error('Texte vide');
          }
        } catch (retryError) {
          console.error('Erreur de transcription après réessai:', retryError);
          transcribedText = "Message vocal (transcription non disponible)";
        }
      }

      // Envoyer le message via WhatsApp
      await sendWhatsAppMessage({
        to: '237671178991',
        type: 'text',
        text: {
          body: `Message vocal transcrit: "${transcribedText}"\n\n(Durée: ${recordingTime}s)`,
        },
      });

      // Ajouter le message vocal avec le texte transcrit dans le chat
      const voiceMessage: Message = {
        id: messages.length + 1,
        text: transcribedText,
        sender: 'user',
        timestamp: new Date(),
        type: 'voice',
        audioUrl: URL.createObjectURL(audioBlob),
        transcribedText
      };
      
      setMessages(prev => [...prev, voiceMessage]);

      // Ajouter la confirmation du bot
      const botResponse: Message = {
        id: messages.length + 2,
        text: "Votre message vocal a été transcrit et envoyé à Ivana via WhatsApp. Elle vous répondra dans les plus brefs délais!",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, botResponse]);
      toast.success('Message vocal transcrit et envoyé avec succès!');
    } catch (error) {
      console.error('Erreur lors du traitement du message vocal:', error);
      toast.error('Erreur lors du traitement du message vocal');
    } finally {
      setIsTyping(false);
      setIsTranscribing(false);
      setRecordingTime(0);
    }
  };

  const sendMessage = async () => {
    if (message.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Send message through WhatsApp API
      await sendWhatsAppMessage({
        to: '237671178991',
        type: 'text',
        text: {
          body: `Message du chatbot: ${message}`,
        },
      });

      // Add bot confirmation message
      const botResponse: Message = {
        id: messages.length + 2,
        text: "Votre message a été envoyé à Ivana via WhatsApp. Elle vous répondra dans les plus brefs délais!",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, botResponse]);
      toast.success('Message envoyé avec succès!');
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Désolé, une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Fonction pour établir la connexion WebSocket
  const connectWebSocket = () => {
    const ws = new WebSocket('ws://localhost:3001/ws');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connecté');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'whatsapp_message') {
          // Ajouter le message WhatsApp au chat
          const whatsappMessage: Message = {
            id: messages.length + 1,
            text: data.message,
            sender: 'bot',
            timestamp: new Date(),
            type: 'text'
          };
          setMessages(prev => [...prev, whatsappMessage]);
        }
      } catch (error) {
        console.error('Erreur lors du traitement du message WebSocket:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket déconnecté');
      // Tenter de se reconnecter après 5 secondes
      setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
    };
  };

  // Établir la connexion WebSocket au chargement du composant
  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <>
      {/* Chat Button */}
      <button
        className={`fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen 
            ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
            : 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
        }`}
        onClick={toggleChat}
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
      >
        {isOpen ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
      </button>
      
      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-8 z-40 w-[85vw] sm:w-[350px] md:w-[380px] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl transition-all duration-300 transform ${
          isOpen 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4 pointer-events-none'
        } max-h-[70vh] flex flex-col border border-gray-200 dark:border-gray-700 backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95`}
      >
        {/* Chat Header */}
        <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center mr-3 shadow-lg transform hover:scale-105 transition-transform duration-200">
              <span className="text-green-500 font-bold text-sm">IM</span>
            </div>
            <div>
              <h3 className="font-semibold text-base">Ivana Marina</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs opacity-90">En ligne</span>
                <span className="text-xs opacity-75">
                  (Disponible)
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => window.open('https://wa.me/237671178991', '_blank')}
            className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
            aria-label="Appeler sur WhatsApp"
          >
            <Phone size={16} className="text-white" />
            <span className="text-xs font-medium">WhatsApp</span>
          </button>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[250px] max-h-[45vh] bg-gray-50 dark:bg-gray-900">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-tl-none border border-gray-200 dark:border-gray-700'
                }`}
              >
                {msg.type === 'voice' && msg.audioUrl ? (
                  <div className="space-y-2">
                    <audio controls className="w-full rounded-lg">
                      <source src={msg.audioUrl} type="audio/wav" />
                      Votre navigateur ne supporte pas l'élément audio.
                    </audio>
                    {msg.transcribedText && (
                      <p className="text-xs italic border-t border-white/20 pt-2 mt-2">
                        "{msg.transcribedText}"
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm">{msg.text}</p>
                )}
                <span className={`text-xs mt-1 block ${msg.sender === 'user' ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 rounded-tl-none border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-2">
                  {isTranscribing ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-green-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-300">Transcription en cours...</span>
                    </>
                  ) : (
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-3xl">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Écrivez votre message..."
              className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-sm transition-all duration-200"
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            {isRecording ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-500">{formatTime(new Date(recordingTime * 1000))}</span>
                <button
                  className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
                  onClick={stopRecording}
                  aria-label="Arrêter l'enregistrement"
                >
                  <Square size={16} />
                </button>
              </div>
            ) : (
              <>
                <button
                  className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
                  onClick={startRecording}
                  aria-label="Enregistrer un message vocal"
                >
                  <Mic size={16} />
                </button>
                <button
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium flex items-center gap-2 disabled:opacity-50 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
                  onClick={sendMessage}
                  disabled={message.trim() === ''}
                  aria-label="Envoyer"
                >
                  <Send size={16} />
                  <span className="hidden sm:inline text-sm">Envoyer</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
