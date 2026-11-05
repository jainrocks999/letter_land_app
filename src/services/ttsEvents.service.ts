import Tts, { TtsEvent } from 'react-native-tts';

interface AddListenersProps {
  onStart?: () => void;
  onFinish?: () => void;
  onCancel?: () => void;
  onProgress?: (start: number, end: number) => void;
}

type AndroidProgressEvent = {
  start?: number;
  end?: number;
};

const TTSEventService = {
  addListeners: ({
    onStart,
    onFinish,
    onCancel,
    onProgress,
  }: AddListenersProps) => {
    const subscriptions: any[] = [];
    if (onStart) {
      subscriptions.push(Tts.addEventListener('tts-start', onStart));
    }
    if (onFinish) {
      subscriptions.push(Tts.addEventListener('tts-finish', onFinish));
    }
    if (onCancel) {
      subscriptions.push(Tts.addEventListener('tts-cancel', onCancel));
    }
    if (onProgress) {
      // Android reports start/end offsets, iOS reports location/length
      const handleProgress = (event: TtsEvent<'tts-progress'>) => {
        const androidEvent = event as AndroidProgressEvent;
        const start = androidEvent.start ?? event.location;
        const end = androidEvent.end ?? event.location + (event.length ?? 0);
        if (Number.isFinite(start) && Number.isFinite(end)) {
          onProgress(start as number, end as number);
        }
      };
      subscriptions.push(Tts.addEventListener('tts-progress', handleProgress));
    }
    return () => {
      subscriptions.forEach(sub => sub?.remove?.());
    };
  },
};

export default TTSEventService;
