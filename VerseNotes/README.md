# VerseNotes - React Native Bible Study App

A React Native application built with Expo for Android 13, specifically optimized for the Daylight DC1 tablet.

## Project Overview

VerseNotes is a Bible study application that allows users to:
- Read Bible verses from multiple translations
- Take and organize study notes
- Export notes to markdown format
- Customize reading preferences and settings

## Technology Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Managed workflow for streamlined development
- **TypeScript**: Type-safe development
- **AsyncStorage**: Local data persistence
- **Bible API**: Integration with api.bible for verse content

## Project Structure

```
VerseNotes/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Screen components
│   │   └── Settings.tsx
│   ├── entities/       # Data models and business logic
│   │   ├── User.ts
│   │   ├── BibleNote.ts
│   │   └── index.ts
│   ├── utils/          # Utility functions and API clients
│   │   └── BibleAPI.ts
│   └── types/          # TypeScript type definitions
├── app.json           # Expo configuration
├── App.tsx            # Main app component
└── package.json       # Dependencies and scripts
```

## Features

### Settings Management
- Default Bible translation selection
- Font size preferences
- Theme customization (light/dark/sepia)
- Auto-save functionality
- Verse number display options
- Paragraph break formatting
- Notification preferences

### Data Management
- Local storage with AsyncStorage
- Note export to markdown format
- User settings persistence

### Bible API Integration
- Support for multiple translations (ESV, NIV, NASB, KJV, NKJV)
- Verse and chapter fetching
- Search functionality
- Proper API headers and error handling

## Android 13 & Tablet Optimization

The app is configured for:
- **Target SDK**: 34 (Android 13)
- **Min SDK**: 33 (Android 13)
- **Tablet Support**: Enabled
- **Screen Orientation**: Adaptive (portrait/landscape)
- **Edge-to-Edge**: Enabled for modern Android experience

## Dependencies

### Core Dependencies
- `@react-native-async-storage/async-storage`: Local data storage
- `react-native-vector-icons`: Icon library
- `react-native-drawer-layout-polyfill`: Drawer navigation support
- `@expo/vector-icons`: Expo's icon set

### Development Dependencies
- `@react-native-community/cli`: React Native CLI tools
- `typescript`: TypeScript support
- `@types/*`: Type definitions

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npx expo start
   ```

3. **Run on Android**:
   ```bash
   npm run android
   ```

4. **Run on web** (for testing):
   ```bash
   npm run web
   ```

## API Configuration

To use the Bible API:

1. Sign up for an API key at [api.bible](https://api.bible)
2. Replace `'your-api-key-here'` in `src/utils/BibleAPI.ts` with your actual API key
3. The API client is configured with proper headers for authentication

## Build Configuration

The project is configured in `app.json` with:
- Android 13 targeting
- Tablet support
- Necessary permissions for network access and storage
- AsyncStorage plugin configuration

## Development Notes

- The app uses TypeScript for type safety
- Entity classes follow the Base44 pattern for data management
- Settings are persisted locally using AsyncStorage
- The UI is optimized for tablet displays with responsive design
- Error handling is implemented throughout the application

## Future Enhancements

- Cloud synchronization
- Advanced search and filtering
- Study plan creation
- Collaborative note sharing
- Offline Bible text caching