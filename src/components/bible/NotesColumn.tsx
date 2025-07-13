import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { BibleNoteData } from '../../entities';
import { useThemeContext } from '../../theme';
import { useNotes } from '../../context/NotesProvider';
import NoteCard from './NoteCard';

interface NotesColumnProps {
  verseReference?: string;
  onAddNote: () => void;
  onEditNote: (note: BibleNoteData) => void;
  refreshTrigger?: number;
}

const NotesColumn: React.FC<NotesColumnProps> = ({
  verseReference,
  onAddNote,
  onEditNote,
  refreshTrigger: _refreshTrigger,
}) => {
  const { theme } = useThemeContext();
  const { notes, deleteNote, isLoading: loading } = useNotes(); // Use hook for notes data
  const [filteredNotes, setFilteredNotes] = useState<BibleNoteData[]>([]);

  // Filter notes based on verseReference
  useEffect(() => {
    const filtered = verseReference
      ? notes.filter((note) => note.verse_reference === verseReference)
      : notes;

    setFilteredNotes(filtered);
  }, [notes, verseReference]);

  // Remove loadNotes and handleRefresh since context handles loading
  // For pull-to-refresh, we can simulate or add refresh to context later

  const handleDeleteNote = async (noteId: string) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteNote(noteId);
          } catch (error) {
            console.error('Error deleting note:', error);
            Alert.alert('Error', 'Failed to delete note. Please try again.');
          }
        },
      },
    ]);
  };

  const renderNote = (note: BibleNoteData) => {
    return <NoteCard key={note.id} note={note} onEdit={onEditNote} onDelete={handleDeleteNote} />;
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
          {verseReference ? `Notes for ${verseReference}` : 'All Notes'}
        </Text>
        <TouchableOpacity
          onPress={onAddNote}
          style={[styles.addButton, { backgroundColor: theme.colors.accent }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.addButtonText, { color: theme.colors.textInverse }]}>+</Text>
        </TouchableOpacity>
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
                  ? 'Tap the + button to add a note for this passage'
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
    fontWeight: 'bold',
    flex: 1,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
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
