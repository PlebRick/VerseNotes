import '@testing-library/jest-native/extend-expect';

// TurboModuleRegistry mock
jest.mock(
  'react-native/Libraries/TurboModule/TurboModuleRegistry',
  () => ({ 
    get: () => null,
    getEnforcing: () => ({}),
  }),
);

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo modules
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        bibleApiUrl: 'https://bible-api.com',
      },
    },
  },
})); 