# VerseNotes - Project Overview

## 🎯 Project Summary

**VerseNotes** is a React Native Bible study application built with Expo, specifically optimized for Android 13 and the Daylight DC1 tablet. The app provides a comprehensive Bible study experience with note-taking capabilities, using the World English Bible (WEB) translation via a public, no-auth API.

## 🏗️ Architecture & Technology Stack

### Core Technologies
- **React Native**: 0.79.5 (Latest with new architecture support)
- **Expo**: SDK 53 (Managed workflow)
- **TypeScript**: 5.8.3 (Full type safety)
- **React**: 19.0.0 (Latest version)

### Key Dependencies
- `@react-native-async-storage/async-storage`: Local data persistence
- `react-native-drawer-layout-polyfill`: Drawer navigation for Android
- `react-native-vector-icons`: Icon support
- `@expo/vector-icons`: Expo icon library
- `react-dom` & `react-native-web`: Web platform support

### Android 13 Configuration
- **minSdkVersion**: 33 (Android 13)
- **targetSdkVersion**: 34 (Android 14)
- **compileSdkVersion**: 34
- **supportsTablet**: true (Daylight DC1 optimization)
- **edgeToEdgeEnabled**: true (Modern Android UI)

## 📁 Project Structure

```
versenotes/
├── src/
│   ├── components/
│   │   └── bible/
│   │       ├── BibleColumn.tsx          # Bible text display component
│   │       ├── BibleSearchBar.tsx       # Search input component
│   │       ├── NoteEditor.tsx           # Note editing modal
│   │       └── NotesColumn.tsx          # Notes management component
│   ├── entities/
│   │   ├── BibleNote.ts                 # Note data model & CRUD operations
│   │   ├── BiblePassage.ts              # Bible passage data & API integration
│   │   ├── User.ts                      # User settings & data management
│   │   └── index.ts                     # Entity exports
│   ├── pages/
│   │   ├── BibleStudy.tsx               # Main study interface
│   │   └── Settings.tsx                 # Settings & configuration page
│   └── utils/
│       └── config.ts                    # (Obsolete) Bible API config placeholder
├── assets/                              # App icons and splash screens
├── App.tsx                              # Main app entry point
├── app.json                             # Expo configuration
├── package.json                         # Dependencies & scripts
├── tsconfig.json                        # TypeScript configuration
└── index.ts                             # App entry point
```

## 🎨 Core Features

### 1. Bible Study Interface (`BibleStudy.tsx`)
- **2-Column Layout**: Responsive design with Bible text and notes columns
- **Drawer Navigation**: Collapsible sidebar with settings and export options
- **Search Integration**: Dynamic passage loading via `BibleSearchBar`
- **Verse Selection**: Tap verses to select for note-taking
- **Tablet Optimization**: Adaptive layout for Daylight DC1 tablet

### 2. Bible Components

#### BibleSearchBar (`BibleSearchBar.tsx`)
- Accepts queries like 'Romans 1:1-16', 'John 3:16'
- Real-time validation of Bible references
- Clean, modern UI with search button
- Auto-capitalization and error handling

#### BibleColumn (`BibleColumn.tsx`)
- Displays Bible text based on `BiblePassage` entity
- Synced with search bar input
- Verse selection and highlighting
- Responsive font sizing (small/medium/large)
- Loading states and error handling

#### NotesColumn (`NotesColumn.tsx`)
- Plus button to add notes linked to verse ranges
- AsyncStorage for local persistence
- Note management (edit, delete, refresh)
- Filtered by verse reference
- Pull-to-refresh functionality

#### NoteEditor (`NoteEditor.tsx`)
- Full-screen note editing experience
- Collapses Bible column when opened (mobile)
- Rich text input with tags support
- Auto-save functionality
- Verse reference linking

### 3. Settings Management (`Settings.tsx`)
- **Bible Settings**: Font size, verse numbers, paragraph breaks
- **App Settings**: Theme, auto-save, notifications
- **Data Management**: Export notes to markdown format
- **Navigation**: Link to Bible Study interface

## 🗄️ Data Models & Entities

### BibleNote (`BibleNote.ts`)
```typescript
interface BibleNoteData {
  id: string;
  title: string;
  content: string;
  verse_reference: string;
  tags: string[];
  created_date: string;
  updated_date: string;
}
```
- **CRUD Operations**: Create, read, update, delete notes
- **Local Storage**: AsyncStorage persistence
- **Sorting**: By creation date, title, etc.
- **Search**: Filter by verse reference

### BiblePassage (`BiblePassage.ts`)
```typescript
interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface FormattedPassage {
  reference: string;
  verses: Verse[];
}
```
- **API Integration**: [bible-api.com](https://bible-api.com) (World English Bible, WEB)
- **Reference Parsing**: Parse "Romans 1:1-16" format
- **Error Handling**: Network and parsing errors

### User (`User.ts`)
```typescript
interface UserSettings {
  font_size: string;
  theme: string;
  auto_save: boolean;
  verse_numbers: boolean;
  paragraph_breaks: boolean;
  notifications: boolean;
}
```
- **Settings Persistence**: AsyncStorage
- **Default Values**: Medium font, light theme
- **User Data**: Name, email, preferences

## 🔌 API Integration

### Bible API (bible-api.com)
- **Base URL**: `https://bible-api.com/`
- **Authentication**: None required
- **Translation**: World English Bible (WEB) only
- **Endpoints**:
  - `/{reference}?translation=web` - Fetch passages (e.g., `/john+3:16?translation=web`)
- **Response Format**:
  ```json
  {
    "reference": "John 3:16",
    "verses": [
      {
        "book_id": "JHN",
        "book_name": "John",
        "chapter": 3,
        "verse": 16,
        "text": "For God so loved the world..."
      }
    ],
    "translation_id": "web"
  }
  ```

## 🎯 Key Features

### 1. Responsive Design
- **Mobile**: Single column with modal note editor
- **Tablet**: Two-column layout with side-by-side Bible and notes
- **Breakpoint**: 768px width for tablet detection

### 2. Local Data Persistence
- **AsyncStorage**: All user data, notes, and settings
- **Offline Capability**: Works without internet (except Bible API calls)
- **Data Export**: Markdown format export functionality

### 3. User Experience
- **Drawer Navigation**: Easy access to settings and features
- **Pull-to-Refresh**: Notes list refresh functionality
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages

### 4. Bible Study Features
- **Verse Selection**: Tap to select verses for note-taking
- **Reference Validation**: Real-time Bible reference parsing
- **Note Organization**: Tags, titles, and verse linking

## 🚀 Development & Deployment

### Development Commands
```bash
npm start          # Start Expo development server
npm run android    # Run on Android device/emulator
npm run web        # Run as web app
npm test           # Run tests (currently disabled - see known_issues.md)
npm run lint       # Run ESLint
```

### Getting Started
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

### Environment Variables
- No `.env` file currently used

## 📱 User Interface

### Design System
- **Colors**: Blue (#007AFF) primary, gray (#666) secondary
- **Typography**: System fonts with responsive sizing
- **Layout**: Flexbox-based responsive design
- **Components**: Custom React Native components

### Navigation
- **Drawer Layout**: Android-style drawer navigation
- **Modal Screens**: Note editor and settings
- **Tab-based**: Future enhancement possibility

### Accessibility
- **Touch Targets**: Minimum 44px touch targets
- **Text Scaling**: Responsive font sizes
- **Color Contrast**: High contrast text and backgrounds

## 🔮 Future Enhancements

### Planned Features
1. **Offline Bible**: Cache passages for offline reading
2. **Cloud Sync**: Note synchronization across devices
3. **Advanced Search**: Full-text search across notes
4. **Export Formats**: PDF and other export options
5. **Study Plans**: Daily reading plans and reminders
6. **Social Features**: Share notes and insights

### Technical Improvements
1. **Performance**: Optimize large note lists
2. **Testing**: Add unit and integration tests
3. **CI/CD**: Automated build and deployment
4. **Analytics**: User behavior tracking

## 🐛 Known Issues & Limitations

### Current Issues
1. **Book Mapping**: Limited Bible book name mapping
2. **Error Handling**: Basic error handling could be improved
3. **Navigation**: No proper navigation stack implementation

### Limitations
1. **Offline**: Bible content requires internet connection
2. **Storage**: Local storage only (no cloud backup)
3. **Search**: Basic reference search only

## 📚 Documentation

### Key Files
- `README.md`: Basic project overview
- `SETUP_LOG.md`: Development setup history
- `IMPLEMENTATION_RESULTS.md`: Feature implementation details
- `PROJECT_OVERVIEW.md`: This comprehensive overview

### Code Documentation
- **TypeScript**: Full type definitions
- **JSDoc**: Function documentation (partial)
- **Comments**: Inline code comments for complex logic

## 🤝 Contributing

### Development Workflow
1. **Feature Branches**: Create feature branches for new development
2. **TypeScript**: Maintain strict type safety
3. **Testing**: Test on both mobile and tablet layouts
4. **Documentation**: Update relevant documentation

### Code Standards
- **TypeScript**: Strict mode compliance
- **React Native**: Functional components with hooks
- **Async/Await**: Modern JavaScript patterns
- **Error Handling**: Comprehensive error handling

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Development Ready  
**Target Platform**: Android 13 (Daylight DC1 Tablet)