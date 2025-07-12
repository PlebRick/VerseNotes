Objective: Complete VerseNotes initialization by adding missing stub files, enhancing entities, and verifying configurations per PRD.

Context: VerseNotes (Expo 53, React Native, Android-13) – Bible study app using WEB Bible API (no auth).

Branch name: bg/complete-init-stubs

Steps:
1. Assume changes from bg/init-project-structure merged; adapt to current repo.
2. Create missing directories: src/components/bible, src/pages.
3. Add stub files: src/pages/BibleStudy.tsx (basic component with 2-column layout placeholder), src/pages/Settings.tsx (if missing, basic settings component), src/components/bible/BibleColumn.tsx (text display stub), BibleSearchBar.tsx (search input stub), NoteEditor.tsx (editor modal stub), NotesColumn.tsx (notes list stub).
4. Enhance entities: src/entities/BibleNote.ts (add interface & CRUD stubs), BiblePassage.ts (add API fetch stub), User.ts (add settings interface).
5. Update app.json if needed: confirm android minSdkVersion 33, targetSdkVersion 34, supportsTablet true, edgeToEdge true.
6. Update README.md: Merge with detailed overview from pasted docs if incomplete.
7. Git add all, commit "Add missing stubs and enhance entities for complete init", push to main.

Write tests first, then the code, run tests until they pass.

After finish, paste PR link and copy summary to development/00_results.md.