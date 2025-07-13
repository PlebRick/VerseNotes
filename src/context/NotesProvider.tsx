import React, { createContext, useContext, ReactNode } from 'react';

import { BibleNoteData } from '../entities/BibleNote';

// Basic context type
export interface NotesContextValue {
  notes: BibleNoteData[];
  addNote: (note: BibleNoteData) => void;
  updateNote: (id: string, note: Partial<BibleNoteData>) => void;
  deleteNote: (id: string) => void;
  isLoading: boolean;
}

// Create context with default values
export const NotesContext = createContext<NotesContextValue>({
  notes: [],
  addNote: () => {},
  updateNote: () => {},
  deleteNote: () => {},
  isLoading: false,
});

// Stub provider component
export const NotesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // TODO: Implement full state management in task 1
  return (
    <NotesContext.Provider value={{
      notes: [],
      addNote: () => console.log('Stub: addNote'),
      updateNote: () => console.log('Stub: updateNote'),
      deleteNote: () => console.log('Stub: deleteNote'),
      isLoading: false,
    }}>
      {children}
    </NotesContext.Provider>
  );
};

// Hook to use notes context
export const useNotes = () => useContext(NotesContext);