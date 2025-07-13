import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BibleNoteData {
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

export class BibleNote {
  static async list(
    sortBy: string = '-created_date',
    limit: number = 100,
  ): Promise<BibleNoteData[]> {
    try {
      const notesData = await AsyncStorage.getItem('bible_notes');
      if (!notesData) {
        return [];
      }

      const notes: BibleNoteData[] = JSON.parse(notesData);

      // Sort notes based on sortBy parameter
      notes.sort((a, b) => {
        const field = sortBy.startsWith('-') ? sortBy.substring(1) : sortBy;
        const isDescending = sortBy.startsWith('-');

        let comparison = 0;
        if (field === 'created_date' || field === 'updated_date') {
          comparison = new Date(a[field]).getTime() - new Date(b[field]).getTime();
        } else {
          comparison = (a[field as keyof BibleNoteData]?.toString() ?? '').localeCompare(
            b[field as keyof BibleNoteData]?.toString() ?? '',
          );
        }

        return isDescending ? -comparison : comparison;
      });

      return notes.slice(0, limit);
    } catch (error) {
      console.error('Error loading notes:', error);
      throw error;
    }
  }

  static async create(
    noteData: Omit<BibleNoteData, 'id' | 'created_date' | 'updated_date'>,
  ): Promise<BibleNoteData> {
    try {
      const newNote: BibleNoteData = {
        ...noteData,
        id: Date.now().toString(),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      };

      const existingNotes = await this.list();
      const updatedNotes = [...existingNotes, newNote];

      await AsyncStorage.setItem('bible_notes', JSON.stringify(updatedNotes));
      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<BibleNoteData>): Promise<BibleNoteData> {
    try {
      const existingNotes = await this.list();
      const noteIndex = existingNotes.findIndex((note) => note.id === id);

      if (noteIndex === -1) {
        throw new Error('Note not found');
      }

      const updatedNote = {
        ...existingNotes[noteIndex],
        ...updates,
        updated_date: new Date().toISOString(),
      };

      existingNotes[noteIndex] = updatedNote;
      await AsyncStorage.setItem('bible_notes', JSON.stringify(existingNotes));

      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const existingNotes = await this.list();
      const filteredNotes = existingNotes.filter((note) => note.id !== id);

      await AsyncStorage.setItem('bible_notes', JSON.stringify(filteredNotes));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<BibleNoteData | null> {
    try {
      const notes = await this.list();
      return notes.find((note) => note.id === id) || null;
    } catch (error) {
      console.error('Error finding note:', error);
      throw error;
    }
  }
}
