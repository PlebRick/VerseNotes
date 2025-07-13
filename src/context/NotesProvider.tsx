import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BibleNoteData } from '../entities/BibleNote';

export interface NotesContextValue {
  notes: BibleNoteData[];
  addNote: (
    note: Omit<BibleNoteData, 'id' | 'created_date' | 'updated_date'>,
  ) => Promise<BibleNoteData>;
  updateNote: (id: string, updates: Partial<BibleNoteData>) => Promise<BibleNoteData>;
  deleteNote: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const NotesContext = createContext<NotesContextValue | undefined>(undefined);

// AsyncStorage key for notes data (v1 schema)
const NOTES_STORAGE_KEY = 'versenotes_notes_v1';

export const NotesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<BibleNoteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load notes from AsyncStorage on mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, []);

  // Save notes to AsyncStorage whenever they change
  useEffect(() => {
    const saveNotes = async () => {
      try {
        await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
      } catch (error) {
        console.error('Error saving notes:', error);
      }
    };

    if (!isLoading) {
      saveNotes();
    }
  }, [notes, isLoading]);

  const addNote = async (noteData: Omit<BibleNoteData, 'id' | 'created_date' | 'updated_date'>) => {
    const newNote: BibleNoteData = {
      id: Date.now().toString(), // Simple ID generation
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
      ...noteData,
    };

    setNotes((prev) => [...prev, newNote]);
    return newNote;
  };

  const updateNote = async (id: string, updates: Partial<BibleNoteData>) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, ...updates, updated_date: new Date().toISOString() } : note,
    );

    setNotes(updatedNotes);

    const updatedNote = updatedNotes.find((note) => note.id === id);
    if (!updatedNote) {
      throw new Error('Note not found');
    }
    return updatedNote;
  };

  const deleteNote = async (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, isLoading }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
