# VerseNotes - Project Overview

## 🎯 Project Summary

**VerseNotes** is a React Native Bible study application built with Expo, specifically optimized for Android 13 and the Daylight DC1 tablet. The app provides a comprehensive Bible study experience with note-taking capabilities, using the World English Bible (WEB) translation via a public, no-auth API. Features Base44-inspired UI design with gray-scale theming optimized for e-ink displays.

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
│   │   ├── bible/
│   │   │   ├── BibleColumn.tsx          # Bible text display component
│   │   │   ├── BibleSearchBar.tsx       # Search input component
│   │   │   ├── NoteCard.tsx             # Enhanced note card with Base44 styling
│   │   │   ├── NoteEditor.tsx           # Note editing modal
│   │   │   └── NotesColumn.tsx          # Notes management component
│   │   └── common/
│   │       └── ButterButton.tsx         # Modern button component with Base44 variants
│   ├── context/
│   │   └── NotesProvider.tsx            # Notes context and state management
│   ├── entities/
│   │   ├── BibleNote.ts                 # Note data model & CRUD operations
│   │   ├── BiblePassage.ts              # Bible passage data & API integration
│   │   ├── User.ts                      # User settings & data management
│   │   └── index.ts                     # Entity exports
│   ├── pages/
│   │   ├── BibleStudy.tsx               # Main study interface
│   │   └── Settings.tsx                 # Settings & configuration page
│   ├── theme.ts                         # Comprehensive theme system with Base44 colors
│   └── utils/
│       └── config.ts                    # (Obsolete) Bible API config placeholder
├── assets/                              # App icons and splash screens
├── development/                         # Development milestone documentation
├── App.tsx                              # Main app entry point
├── app.json                             # Expo configuration
├── package.json                         # Dependencies & scripts
├── tsconfig.json                        # TypeScript configuration
└── index.ts                             # App entry point
```

## 🎨 Core Features

### 1. Bible Study Interface (`BibleStudy.tsx`)
- **Base44-Inspired Layout**: Clean, modern design optimized for Daylight DC1
- **2-Column Layout**: Responsive design with Bible text and notes columns
- **Simplified Navigation**: Streamlined header with VerseNotes branding and settings
- **Search Integration**: Column-specific Bible search with Base44 styling
- **Verse Selection**: Tap verses to select for note-taking
- **Tablet Optimization**: Adaptive layout for Daylight DC1 tablet

### 2. Bible Components

#### BibleSearchBar (`BibleSearchBar.tsx`)
- Accepts queries like 'Romans 1:1-16', 'John 3:16'
- Base44-styled with gray borders and rounded corners
- Enhanced placeholder text with search examples
- Auto-capitalization and error handling
- Scoped to Bible column width for proper alignment

#### BibleColumn (`BibleColumn.tsx`)
- Displays Bible text based on `BiblePassage` entity
- Synced with search bar input
- Verse selection and highlighting
- Responsive font sizing (small/medium/large)
- Loading states and error handling

#### NotesColumn (`NotesColumn.tsx`)
- Modern "Note" button with Base44 gray styling
- AsyncStorage for local persistence
- Note management (edit, delete, refresh)
- Filtered by verse reference
- Pull-to-refresh functionality

#### NoteCard (`NoteCard.tsx`)
- Enhanced Base44 design with gray color scheme
- Verse reference chip with proper positioning and full range display
- Reorganized layout with chip and date in top row
- Improved typography and spacing
- Modern button styling with consistent theming

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
- **Modern Navigation**: Updated settings button with gear icon and text

### 4. Theme System (`theme.ts`)
- **Base44 Color Palette**: Gray-scale design optimized for e-ink displays
- **Dark Mode Support**: Complete light/dark theme system
- **89 Color Tokens**: Comprehensive design system
- **Accessibility Compliance**: WCAG 2.1 AA compliant contrast ratios
- **Daylight DC1 Optimization**: Specific color tokens for e-ink displays

## 🗄️ Data Models & Entities

### BibleNote (`BibleNote.ts`)
```typescript
interface BibleNoteData {
  id: string;
  title: string;
  content: string;
  verse_reference: string;
  start_verse?: number;
  end_verse?: number;
  tags: string[];
  created_date: string;
  updated_date: string;
}
```
- **CRUD Operations**: Create, read, update, delete notes
- **Local Storage**: AsyncStorage persistence
- **Sorting**: By creation date, title, etc.
- **Search**: Filter by verse reference
- **Enhanced Verse Ranges**: Support for start_verse and end_verse fields

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
- **Base44 Design**: Clean, modern interface optimized for e-ink displays
- **Simplified Navigation**: Streamlined header and settings access
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages

### 4. Bible Study Features
- **Verse Selection**: Tap to select verses for note-taking
- **Reference Validation**: Real-time Bible reference parsing
- **Note Organization**: Tags, titles, and verse linking
- **Enhanced Verse References**: Full range display in note cards

## 🚀 Development & Deployment

### Development Commands
```bash
npx expo start          # Start Expo development server
npx expo start --clear  # Start with cleared cache
```

### Version History
- **v0.2.3-stable**: Base44 UI implementation with gray theme and improved layout
- **v0.2.2-stable**: UI theming and dark mode system
- **v0.2.1-stable**: Notes enhancement and functionality improvements
- **v0.1.0-ui**: Initial UI theming implementation

## 🔧 Configuration & Setup

### Required Setup
1. **Node.js**: Version 18+ recommended
2. **Expo CLI**: Global installation for development
3. **Android Studio**: For Android development (optional)

### Environment Variables
- No `.env` file currently used

### Dependencies Management
- **npm**: Package manager
- **Expo**: Dependency resolution and compatibility
- **React Native**: Core framework dependencies

## 📱 User Interface

### Design System
- **Base44 Color Palette**: Gray-scale design optimized for Daylight DC1
- **Typography**: System fonts with responsive sizing
- **Layout**: Flexbox-based responsive design
- **Components**: Custom React Native components with Base44 styling

### Navigation
- **Simplified Header**: Clean navigation with VerseNotes branding
- **Modal Screens**: Note editor and settings
- **Modern Settings**: Gear icon with "Settings" text

### Accessibility
- **Touch Targets**: Minimum 44px touch targets
- **Text Scaling**: Responsive font sizes
- **Color Contrast**: WCAG 2.1 AA compliant contrast ratios

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
- `development/`: Milestone documentation and development history

### Development Documentation
- `development/01_development.md`: Project initialization and API migration
- `development/02_notes_enhancement.md`: Notes functionality improvements
- `development/03_ui_theming.md`: UI theming and dark mode implementation
- `development/04_base44_ui_implementation.md`: Base44 UI design implementation

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

**Last Updated**: January 2025  
**Version**: v0.2.3-stable  
**Status**: Production Ready  
**Target Platform**: Android 13 (Daylight DC1 Tablet) 