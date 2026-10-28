import Tts from 'react-native-tts';

// voice settings chosen by the parent in the settings modal
let isMuted = false;
let rateMultiplier = 1;
let baseRate = 0.25;

// speechRate = 0.45
const TTSService = {
  init: async (language = 'en-US', speechRate = 0.25, pitch = 1.0) => {
    try {
      await Tts.getInitStatus();

      Tts.setDefaultLanguage(language);
      TTSService.setSpeechRate(speechRate);
      Tts.setDefaultPitch(pitch);
    } catch (error) {
      console.log('TTs init Error:', error);
    }
  },

  speak: (text: string) => {
    Tts.stop();
    if (isMuted) return;
    Tts.speak(text);
  },

  setMuted: (muted: boolean) => {
    isMuted = muted;
    if (muted) Tts.stop();
  },

  setRateMultiplier: (multiplier: number) => {
    rateMultiplier = multiplier;
    TTSService.setSpeechRate(baseRate);
  },

  stop: () => {
    Tts.stop();
  },

  setLanguage: async (language: string) => {
    try {
      await Tts.setDefaultLanguage(language);
    } catch (error) {
      console.log(error);
    }
  },

  setSpeechRate: (speechRate: number = 0.25) => {
    baseRate = speechRate;
    Tts.setDefaultRate(Math.min(speechRate * rateMultiplier, 1));
  },
  //    speakCorrectAnswer: () => {
  //     Tts.stop();
  //     Tts.speak('Great job!');
  //   },

  //   speakWrongAnswer: () => {
  //     Tts.stop();
  //     Tts.speak('Try again!');
  //   },

  //   speakCastleUnlocked: () => {
  //     Tts.stop();
  //     Tts.speak('Congratulations! You unlocked a new castle.');
  //   },
};

export default TTSService;
