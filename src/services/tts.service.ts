import Tts from 'react-native-tts';
// speechRate = 0.45
const TTSService = {
  init: async (language = 'en-US', speechRate = 0.25, pitch = 1.0) => {
    try {
      await Tts.getInitStatus();

      Tts.setDefaultLanguage(language);
      Tts.setDefaultRate(speechRate);
      Tts.setDefaultPitch(pitch);
    } catch (error) {
      console.log('TTs init Error:', error);
    }
  },

  speak: (text: string) => {
    Tts.stop();
    Tts.speak(text);
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
