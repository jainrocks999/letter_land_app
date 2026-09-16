jest.mock('react-native-mmkv', () => ({
  createMMKV: () => ({
    set: jest.fn(),
    getString: jest.fn(),
    getNumber: jest.fn(),
    getBoolean: jest.fn(),
    delete: jest.fn(),
    contains: jest.fn(),
  }),
}));

jest.mock('react-native-tts', () => ({
  getInitStatus: jest.fn().mockResolvedValue(true),
  setDefaultLanguage: jest.fn(),
  setDefaultRate: jest.fn(),
  setDefaultPitch: jest.fn(),
  speak: jest.fn(),
  stop: jest.fn(),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  removeEventListener: jest.fn(),
}));

jest.mock('react-native-reanimated', () => {
  const reanimated = require('react-native-reanimated/mock');
  reanimated.default.call = () => {};
  return reanimated;
});

jest.mock('react-native-worklets', () => ({
  runOnJS: (fn) => fn,
}));
