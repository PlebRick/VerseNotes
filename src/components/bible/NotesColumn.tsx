import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { BibleNoteData } from '../../entities';
import { useThemeContext } from '../../theme';
import { useNotes } from '../../context/NotesProvider';
import NoteCard from './NoteCard';
import ButterButton from '../common/ButterButton';

interface NotesColumnProps {
  verseReference?: string;
  onAddNote: () => void;
  onEditNote: (note: BibleNoteData) => void;
  onViewNote?: (note: BibleNoteData) => void;
  refreshTrigger?: number;
}

const NotesColumn: React.FC<NotesColumnProps> = ({
  verseReference,
  onAddNote,
  onEditNote,
  onViewNote,
  refreshTrigger: _refreshTrigger,
}) => {
  const { theme } = useThemeContext();
  const { notes, deleteNote, isLoading: loading } = useNotes(); // Use hook for notes data
  const [filteredNotes, setFilteredNotes] = useState<BibleNoteData[]>([]);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Smart note filtering function
  const matchesPassage = (note: BibleNoteData, targetReference: string): boolean => {
    if (!targetReference) return true; // Show all notes if no target reference

    // Exact match with verse_reference
    if (note.verse_reference && note.verse_reference === targetReference) {
      return true;
    }

    // Fallback: check if note title contains the passage reference
    // Handle cases like "Romans 1" matching notes titled "Romans 1:1-5"
    if (note.title) {
      // Extract book and chapter from target (e.g., "Romans 1")
      const targetParts = targetReference.split(' ');
      if (targetParts.length >= 2) {
        const book = targetParts[0]; // "Romans"
        const chapter = targetParts[1]; // "1"

        // Check if note title starts with "Book Chapter:" (e.g., "Romans 1:")
        const expectedPrefix = `${book} ${chapter}:`;
        if (note.title.startsWith(expectedPrefix)) {
          return true;
        }

        // Also check for exact match with title
        if (note.title === targetReference) {
          return true;
        }
      }
    }

    return false;
  };

  // Filter notes based on verseReference
  useEffect(() => {
    const filtered = verseReference
      ? notes.filter((note) => matchesPassage(note, verseReference))
      : notes;

    setFilteredNotes(filtered);
    // Reset expansion when notes change
    setExpandedCardId(null);
  }, [notes, verseReference]);

  const handleDeleteNote = async (noteId: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(noteId);
              // Clear expansion if the deleted note was expanded
              if (expandedCardId === noteId) {
                setExpandedCardId(null);
              }
            } catch (error) {
              console.error('Error deleting note:', error);
              Alert.alert('Error', 'Failed to delete note. Please try again.');
            }
          },
        },
      ],
    );
  };

  const handleExpandToggle = (noteId: string) => {
    // Toggle expansion: if same card, collapse it; if different card, expand the new one
    setExpandedCardId(expandedCardId === noteId ? null : noteId);
  };

  const handleViewNote = (note: BibleNoteData) => {
    if (onViewNote) {
      onViewNote(note);
    }
  };

  const renderNote = (note: BibleNoteData) => {
    return (
      <NoteCard
        key={note.id}
        note={note}
        onEdit={() => onEditNote(note)}
        onDelete={() => handleDeleteNote(note.id)}
        onView={() => handleViewNote(note)}
        isExpanded={expandedCardId === note.id}
        onExpandToggle={handleExpandToggle}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.backgroundSecondary }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {verseReference ? `Notes for ${verseReference}` : 'Study Notes'}
        </Text>
        <ButterButton
          title="Note"
          onPress={onAddNote}
          variant="darkGray"
          size="small"
          icon="📝"
          style={styles.addButton}
        />
      </View>

      {loading && filteredNotes.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading notes...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => {}} // No direct refresh control for now, context handles it
              colors={[theme.colors.accent]}
            />
          }
        >
          {filteredNotes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>No notes yet</Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
                {verseReference
                  ? 'Tap the Note button to add a note for this passage'
                  : 'Search for a Bible passage and start taking notes'}
              </Text>
            </View>
          ) : (
            <View style={styles.notesContainer}>{filteredNotes.map(renderNote)}</View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  addButton: {
    // Button styles handled by ButterButton
  },
  scrollView: {
    flex: 1,
  },
  notesContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default NotesColumn;
