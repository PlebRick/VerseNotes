# PDR: Migrate VerseNotes to Plain Text Note Editing (Android-Native, No Scope Drift)

## PLAN

### Goal
- Replace all rich text (HTML/WebView-based) note editing and viewing with plain text, using only React Native’s native components.
- Preserve all UI/UX except for the content input area (no drive-by refactors).
- Ensure import/export, data model, and all note-related features work with plain text.
- Remove all rich text and WebView dependencies.

### Scope of Work

#### A. Note Editing
- Replace `react-native-pell-rich-editor` with a plain `<TextInput>` in `NoteEditor.tsx`.
- Remove formatting toolbar and any HTML-specific logic.
- Ensure all note metadata (title, tags, verse range) and save/cancel flows remain unchanged.

#### B. Note Viewing
- Update `NoteReader.tsx` and `NoteCard.tsx` to render plain text (not HTML).
- Remove any WebView or HTML rendering logic.
- Ensure line breaks and basic formatting are preserved for readability.

#### C. Import/Export
- Update export logic (in `Settings.tsx` or related utils) to output plain text in the `content` field.
- Update import logic to expect and handle plain text.
- (Optional) Add a one-time migration/cleanup for any existing HTML notes (strip tags on load/export).

#### D. Data Model
- Ensure `BibleNote.ts` and all CRUD logic treat `content` as plain text.
- Update any type annotations or documentation to reflect this.

#### E. Notes Management
- Audit `NotesColumn.tsx`, `BibleStudy.tsx`, and any other files that create, edit, or display notes to ensure they use the new plain text editor and viewer.

#### F. Dependencies
- Remove `react-native-pell-rich-editor` and `react-native-webview` from `package.json`.
- Remove any related imports/usages throughout the codebase.

#### G. Tests
- Update or add tests to verify plain text note creation, editing, viewing, and export/import.

#### H. Documentation
- Update `README.md`, `development/` docs, and any in-app help to reflect the plain text system.

## DO (Step-by-Step Tasks)

Each step = 1 Cursor TODO = 1 commit.

1. **Create a backup branch** from the current state (safety net).
2. **Remove rich text and WebView dependencies** from `package.json` and run a clean install.
3. **Replace rich text editor in `NoteEditor.tsx`** with a plain `<TextInput>`, preserving all other UI/UX.
4. **Update `NoteReader.tsx` and `NoteCard.tsx`** to render plain text, removing any HTML/WebView logic.
5. **Update note CRUD logic in `BibleNote.ts`** to treat `content` as plain text.
6. **Update import/export logic** in `Settings.tsx` (and any utils) to handle plain text.
7. **Audit and update all note management flows** (`NotesColumn.tsx`, `BibleStudy.tsx`, etc.) to use the new editor/viewer.
8. **(Optional) Add a migration/cleanup step** to strip HTML tags from any existing notes on load/export.
9. **Update or add tests** for plain text note creation, editing, viewing, and export/import.
10. **Update documentation** (`README.md`, `development/` docs) to reflect the new system.
11. **Manual QA:** Test on Android and web to ensure all note features work and UI/UX is preserved.
12. **Review and polish:** Address any regressions, edge cases, or feedback.

## REVIEW

- Confirm all note editing, viewing, import/export, and management features work as expected on Android and web.
- Confirm all UI/UX (except content formatting) is unchanged.
- Confirm all dependencies are clean and no longer include rich text or WebView.
- Confirm documentation and tests are up to date.
- Confirm no scope drift or drive-by refactors. 