import Tts from 'react-native-tts';

interface AddListenersProps {
  onStart?: () => void;
  onFinish?: () => void;
  onCancel?: () => void;
}

const TTSEventService = {
  addListeners: ({ onStart, onFinish, onCancel }: AddListenersProps) => {
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
    return () => {
      subscriptions.forEach(sub => sub?.remove?.());
    };
  },
};

export default TTSEventService;

