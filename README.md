# VerseNotes - Comprehensive Bible Study App

## 🎯 Project Summary

**VerseNotes** is a React Native Bible study application built with Expo, specifically optimized for Android 13 and the Daylight DC1 tablet. The app provides a comprehensive Bible study experience with advanced note-taking capabilities, using the World English Bible (WEB) translation via a public, no-auth API. Features Base44-inspired UI design with gray-scale theming optimized for e-ink displays.

**Current Version**: v0.2.1 (January 2025)

## ✨ Key Features

### 📝 **Advanced Note-Taking**
- **Rich text editing** with HTML content support
- **Expandable card view** for quick note preview
- **Full-screen reader** optimized for public speaking
- **Font size controls** (14-32px) with persistence
- **Verse-specific notes** with automatic Bible text integration

### 📖 **Bible Study Tools**
- **World English Bible (WEB)** integration via bible-api.com
- **Automatic verse fetching** for note context
- **Verse range support** (single verses to full chapters)
- **Search functionality** across Bible passages
- **Responsive layout** for landscape/portrait modes

### 💾 **Comprehensive Backup System**
- **Multiple export formats**: JSON (backup), Markdown (sharing), Plain Text (universal)
- **Complete data backup** including notes, settings, and metadata
- **Import with conflict resolution** (Replace vs Merge modes)
- **Cross-platform file handling** (web download, mobile sharing)
- **Data integrity validation** with checksums and structure verification

### 🎨 **Optimized UI/UX**
- **Base44 design language** with gray-scale theming
- **E-ink display optimization** for Daylight DC1 tablet
- **Responsive design** with landscape orientation support
- **Accessibility features** with proper contrast and touch targets
- **Smooth animations** with LayoutAnimation support

## 🏗️ Architecture & Technology Stack

### Core Technologies
- **React Native**: 0.79.5 (Latest with new architecture support)
- **Expo**: SDK 53 (Managed workflow)
- **TypeScript**: 5.8.3 (Full type safety)
- **React**: 19.0.0 (Latest version)

### Key Dependencies
- `@react-native-async-storage/async-storage`: Local data persistence
- `react-native-pell-rich-editor`: Rich text editing capabilities
- `expo-document-picker`: File import functionality
- `expo-file-system`: File system access for exports
- `expo-sharing`: Native sharing capabilities
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
│   │   │   ├── NoteCard.tsx             # Individual note display with expand/collapse
│   │   │   ├── NoteEditor.tsx           # Rich text note editing modal
│   │   │   ├── NoteReader.tsx           # Full-screen note reader for public speaking
│   │   │   ├── NotesColumn.tsx          # Notes management component
│   │   │   └── VerseBracket.tsx         # Verse highlighting component
│   │   ├── common/
│   │   │   └── ButterButton.tsx         # Themed button component
│   │   └── context/
│   │       └── NotesProvider.tsx        # Global notes state management
│   ├── entities/
│   │   ├── BibleNote.ts                 # Note data model & CRUD operations
│   │   ├── BiblePassage.ts              # Bible passage data & API integration
│   │   ├── User.ts                      # User settings & data management
│   │   └── index.ts                     # Entity exports
│   ├── pages/
│   │   ├── BibleStudy.tsx               # Main study interface
│   │   └── Settings.tsx                 # Settings & comprehensive backup system
│   ├── theme.ts                         # Base44 theming system
│   └── utils/
│       └── config.ts                    # Configuration utilities
├── assets/                              # App icons and splash screens
├── development/                         # Development documentation
│   ├── backup_restore_system.md         # Comprehensive backup system docs
│   ├── 01_development.md                # Development milestones
│   └── [other dev docs]                 # Various development guides
└── patches/                             # React Native patches
    └── react-native+0.79.5.patch       # Custom RN patches
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ with npm
- Expo CLI: `npm install -g @expo/cli`
- For mobile testing: Expo Go app or development build

### Installation
```bash
# Clone the repository
git clone https://github.com/PlebRick/VerseNotes.git
cd versenotes

# Install dependencies
npm install

# Start development server
npx expo start --clear

# Platform-specific commands
npx expo start --web          # Web browser
npx expo start --android      # Android device/emulator
npx expo start --ios          # iOS simulator (macOS only)
```

### Development Commands
```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Code formatting
npm run format

# Testing (currently disabled - see development/known_issues.md)
npm test
```

## 📱 Platform Support

### Primary Platforms
- **Android 13+**: Optimized for Daylight DC1 tablet
- **Web**: Full functionality with browser file handling
- **iOS**: Compatible with standard iOS features

### Device Optimization
- **Daylight DC1 Tablet**: E-ink display optimization with high contrast
- **Landscape Mode**: Enhanced layout for public speaking scenarios
- **Touch Targets**: Optimized for tablet interaction
- **Font Scaling**: Accessibility support with large text options

## 🔧 Core Features Deep Dive

### Note Management
- **Rich Text Editor**: HTML-based content with formatting support
- **Expandable Cards**: Quick preview with triangle icon expansion
- **Full Reader Mode**: Dedicated reading interface for presentations
- **Verse Integration**: Automatic Bible text fetching for note context
- **Tag System**: Categorization and organization support

### Bible Integration
- **API**: bible-api.com (no authentication required)
- **Translation**: World English Bible (WEB) - public domain
- **Verse Ranges**: Support for single verses to full chapters
- **Error Handling**: Graceful degradation for network issues
- **Caching**: Efficient verse retrieval and storage

### Backup & Export System
- **JSON Export**: Complete backup with import capability
- **Markdown Export**: Readable format with Bible verses for sharing
- **Plain Text Export**: Universal compatibility for any platform
- **Import Modes**: Replace (full restore) vs Merge (preserve existing)
- **Data Validation**: Comprehensive structure and integrity checking
- **Cross-Platform**: Web download and mobile sharing support

## 🎨 Design Philosophy

### Base44 Design Language
- **Gray-scale palette** optimized for e-ink displays
- **High contrast** for readability in various lighting
- **Minimal animations** to reduce e-ink refresh artifacts
- **Clean typography** with readable font sizes
- **Consistent spacing** and visual hierarchy

### Accessibility
- **WCAG compliance** with proper contrast ratios
- **Touch target sizing** for tablet interaction
- **Font scaling** support for vision accessibility
- **Screen reader** compatibility
- **Keyboard navigation** support

## 📊 Current Status

### Version History
- **v0.1.0**: Initial release with basic note-taking
- **v0.2.0-ux**: Enhanced UI with expandable cards and reader mode
- **v0.2.1**: Comprehensive backup system with multiple export formats

### Recent Milestones
- ✅ **Expandable note cards** with smooth animations
- ✅ **Full-screen reader** optimized for public speaking
- ✅ **Font size controls** with persistence (14-32px range)
- ✅ **Bible verse auto-fetching** for note context
- ✅ **Comprehensive backup system** with JSON/Markdown/Plain Text exports
- ✅ **Import functionality** with conflict resolution
- ✅ **Cross-platform file handling** for web and mobile
- ✅ **Data integrity validation** with checksums

### Known Issues
- Jest testing temporarily disabled (see `development/known_issues.md`)
- Some Expo package version mismatches (non-critical)
- Limited to WEB Bible translation (by design)

## 🔮 Future Roadmap

### Planned Features
- **Multiple Bible translations** (ESV, NIV, KJV support)
- **Cloud synchronization** (Google Drive, iCloud integration)
- **Advanced search** across notes and Bible text
- **Study plans** and reading schedules
- **Collaboration features** for group studies
- **PDF export** with formatted layouts
- **Offline mode** improvements

### Technical Improvements
- **Performance optimization** for large note collections
- **Enhanced caching** for Bible verses
- **Progressive Web App** features
- **Native module optimization**
- **Test suite restoration** and expansion

## 🤝 Contributing

### Development Setup
1. Follow installation instructions above
2. Review `development/` documentation
3. Check `development/known_issues.md` for current limitations
4. Follow conventional commit format: `feat:`, `fix:`, `docs:`, `chore:`

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured for React Native best practices
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Bible API**: bible-api.com for free WEB translation access
- **Expo Team**: For excellent React Native development tools
- **Daylight Computer**: For e-ink display optimization inspiration
- **Base44**: For clean, accessible design language principles

---

**Last Updated**: January 2025
**Version**: v0.2.1
**Platform**: React Native with Expo SDK 53