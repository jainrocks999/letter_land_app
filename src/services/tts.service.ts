import Tts from 'react-native-tts';

// voice settings chosen by the parent in the settings modal
let isMuted = false;
let rateMultiplier = 1;
let baseRate = 0.25;

// speechRate = 0.45

// On iOS, Tts.stop() passes `undefined` as the `onWordBoundary` BOOL argument.
// With the New Architecture that cannot be converted to Objective-C BOOL and
// throws "Error while converting JavaScript argument 0 to Objective C type BOOL".
// Always pass an explicit boolean: false = AVSpeechBoundaryImmediate.
const stopSpeech = () => Tts.stop(false);

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
    stopSpeech();
    if (isMuted) return;
    Tts.speak(text);
  },

  setMuted: (muted: boolean) => {
    isMuted = muted;
    if (muted) stopSpeech();
  },

  setRateMultiplier: (multiplier: number) => {
    rateMultiplier = multiplier;
    TTSService.setSpeechRate(baseRate);
  },

  stop: () => {
    stopSpeech();
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
  //     Tts.stop(false);
  //     Tts.speak('Great job!');
  //   },

  //   speakWrongAnswer: () => {
  //     Tts.stop(false);
  //     Tts.speak('Try again!');
  //   },

  //   speakCastleUnlocked: () => {
  //     Tts.stop(false);
  //     Tts.speak('Congratulations! You unlocked a new castle.');
  //   },
};

export default TTSService;
