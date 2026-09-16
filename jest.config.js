module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/__tests__/setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-reanimated|react-native-mmkv|react-native-tts|react-native-worklets|react-native-gesture-handler|react-native-svg|@react-native-vector-icons|@react-native-community)/)',
  ],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__tests__/__mocks__/svgMock.js',
  },
};





