import Tts from 'react-native-tts';

interface AddListenersProps {
  onStart?: () => void;
  onFinish?: () => void;
  onCancel?: () => void;
}

const TTSEventService = {
  addListeners: ({ onStart, onFinish, onCancel }: AddListenersProps) => {
    if (onStart) {
      Tts.addEventListener('tts-start', onStart);
    }
    if (onFinish) {
      Tts.addEventListener('tts-finish', onFinish);
    }
    if (onCancel) {
      Tts.addEventListener('tts-cancel', onCancel);
    }
  },
};

export default TTSEventService;
