module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo(nent)?|@expo(nent)?/.*)',
  ],
  // Scope Jest to logic tests only - exclude component tests with RN compatibility issues
  testMatch: [
    '**/__tests__/**/*.logic.(ts|tsx|js)',
    '**/*.logic.(test|spec).(ts|tsx|js)',
  ],
}; 