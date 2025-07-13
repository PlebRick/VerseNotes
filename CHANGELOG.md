# VerseNotes Changelog

All notable changes to the VerseNotes project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.2.1] - 2025-01-15 - Comprehensive Backup System

### 🚀 Major Features Added
- **Complete Backup/Restore System** with multiple export formats
- **JSON Export** with full backup capability and import functionality
- **Markdown Export** with Bible verses for sharing and documentation
- **Plain Text Export** for universal compatibility
- **Import Functionality** with conflict resolution (Replace vs Merge modes)
- **Cross-Platform File Handling** (web download, mobile sharing)
- **Data Integrity Validation** with checksums and structure verification

### ✨ Enhanced Features
- **Enhanced Note Reader** with full-screen mode optimized for public speaking
- **Font Size Controls** (14-32px range) with AsyncStorage persistence
- **Bible Verse Auto-Fetching** for all export formats with context integration
- **Export Format Selector** with visual UI for choosing export type
- **Filename Customization** with format-specific extensions and timestamps

### 🔧 Technical Improvements
- **Comprehensive Data Validation** for import operations
- **Error Handling** with user-friendly error messages
- **Progress Reporting** for import/export operations
- **TypeScript Compliance** with strict type checking
- **Cross-Platform Compatibility** tested on web, Android, and iOS

### 📚 Documentation
- **Complete System Documentation** in `development/backup_restore_system.md`
- **Updated README.md** with comprehensive feature overview
- **Enhanced PROJECT_OVERVIEW.md** with technical details
- **Development Milestone Documentation** updated

### 🐛 Bug Fixes
- **Bible Translation Display** corrected from "ESV" to "WEB" in Settings
- **Verse Spacing Issues** resolved with improved layout (12px → 20px spacing)
- **Large Font Size Layout** fixed overlap issues with responsive verse number width
- **Export Button Functionality** restored with cross-platform implementation

### 🎨 UI/UX Improvements
- **Expandable Note Cards** with smooth triangle icon animations
- **Base44 Design Language** consistency across all components
- **Responsive Layout** optimized for landscape/portrait modes
- **Accessibility Enhancements** with proper contrast and touch targets

## [v0.2.0-ux] - 2024-12-20 - Enhanced UI & User Experience

### ✨ Features Added
- **Expandable Note Cards** with smooth animations
- **Rich Text Editor** with HTML content support
- **Full-Screen Note Reader** optimized for public speaking
- **Font Size Controls** with persistence
- **Button Reorganization** (View, Edit, Delete actions)

### 🎨 UI Improvements
- **Base44 Design Language** implementation
- **Gray-scale Theming** optimized for e-ink displays
- **Smooth Animations** using LayoutAnimation
- **Responsive Design** for various screen sizes

### 🔧 Technical Changes
- **Context State Management** with NotesProvider
- **Theme System** with comprehensive Base44 colors
- **Component Restructuring** for better maintainability
- **TypeScript Enhancements** with strict type checking

## [v0.1.0] - 2024-11-15 - Initial Release

### 🚀 Core Features
- **Bible Study Interface** with 2-column layout
- **Note-Taking System** with rich text editing
- **Bible Integration** using WEB translation via bible-api.com
- **Local Storage** with AsyncStorage persistence
- **Verse Selection** and highlighting
- **Search Functionality** for Bible passages

### 🏗️ Technical Foundation
- **React Native** 0.79.5 with Expo SDK 53
- **TypeScript** 5.8.3 with strict type checking
- **Entity System** (BibleNote, BiblePassage, User)
- **API Integration** with bible-api.com
- **Cross-Platform Support** (web, Android, iOS)

### 📱 Platform Optimization
- **Android 13** optimization for Daylight DC1 tablet
- **Responsive Design** for mobile and tablet
- **E-ink Display** optimization
- **Touch Target** optimization

## [Unreleased] - Future Features

### 🔮 Planned Features
- **Multiple Bible Translations** (ESV, NIV, KJV)
- **Cloud Synchronization** (Google Drive, iCloud)
- **Advanced Search** across notes and Bible text
- **Study Plans** and reading schedules
- **Collaboration Features** for group studies
- **PDF Export** with formatted layouts
- **Offline Mode** enhancements

### 🛠️ Technical Improvements
- **Performance Optimization** for large note collections
- **Enhanced Caching** for Bible verses
- **Progressive Web App** features
- **Test Suite Restoration** with comprehensive testing
- **Native Module Optimization**

## Development Notes

### Version Numbering
- **Major** (X.0.0): Significant architectural changes or major feature additions
- **Minor** (0.X.0): New features, UI improvements, or substantial enhancements
- **Patch** (0.0.X): Bug fixes, minor improvements, or documentation updates

### Platform Support
- **Primary**: Android 13+ (Daylight DC1 tablet optimization)
- **Secondary**: Web (full functionality), iOS (standard features)
- **Testing**: All platforms tested for each release

### Dependencies
- **React Native**: 0.79.5 (New Architecture support)
- **Expo SDK**: 53 (Managed workflow)
- **TypeScript**: 5.8.3 (Strict type checking)
- **Key Libraries**: AsyncStorage, Pell Rich Editor, Document Picker, File System

### Known Issues
- Jest testing framework temporarily disabled
- Some Expo package version mismatches (non-critical)
- Limited to WEB Bible translation (by design choice)

### Development Process
- **Feature-Driven Development**: Each version focuses on specific user needs
- **Documentation-First**: Comprehensive documentation for all features
- **Cross-Platform Testing**: Validation on all supported platforms
- **TypeScript Compliance**: Strict type checking with zero errors

## [v0.2.9] - 2025-07-13 - Note Creation Crash Fix

### 🐛 Bug Fixes
- **Fixed crash when adding a new note on Android/Daylight DC1**
  - **Root Cause**: The `originWhitelist` prop for the rich text editor's WebView was passed as a string instead of an array, causing a native type error (`expected dynamic type 'array', but had type 'string'`).
  - **Fix**: Added `originWhitelist={SAFE_ORIGIN_WHITELIST}` to the `RichEditor` component and created a utility constant to enforce correct typing. Upgraded `react-native-webview` and `react-native-pell-rich-editor` to latest compatible versions.
  - **Impact**: Note creation and editing now work reliably on all platforms, including Android 13+ and Daylight DC1 tablet. Crash is fully resolved.

---

**Changelog Maintained By**: Development Team  
**Last Updated**: January 15, 2025  
**Format**: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
**Versioning**: [Semantic Versioning](https://semver.org/spec/v2.0.0.html) 