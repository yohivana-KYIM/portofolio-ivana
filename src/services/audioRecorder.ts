export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private maxDuration: number;
  private timer: NodeJS.Timeout | null = null;
  private startTime: number = 0;

  constructor(maxDurationInSeconds: number = 60) {
    this.maxDuration = maxDurationInSeconds * 1000; // Convert to milliseconds
  }

  async startRecording(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];
      this.startTime = Date.now();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();

      // Set up timer to stop recording after maxDuration
      this.timer = setTimeout(() => {
        this.stopRecording();
      }, this.maxDuration);

    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.cleanup();
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  getRecordingDuration(): number {
    return Date.now() - this.startTime;
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }
} 