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
import { BibleNote, BibleNoteData } from '../../entities';
import { useThemeContext } from '../../theme';

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
  refreshTrigger,
}) => {
  const { theme } = useThemeContext();
  const [notes, setNotes] = useState<BibleNoteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [refreshTrigger]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const allNotes = await BibleNote.list('-updated_date', 100);

      // Filter notes by verse reference if provided
      const filteredNotes = verseReference
        ? allNotes.filter((note) => note.verse_reference === verseReference)
        : allNotes;

      setNotes(filteredNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
      Alert.alert('Error', 'Failed to load notes. Please try again.');
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await BibleNote.delete(noteId);
            await loadNotes();
          } catch (error) {
            console.error('Error deleting note:', error);
            Alert.alert('Error', 'Failed to delete note. Please try again.');
          }
        },
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderNote = (note: BibleNoteData) => {
    return (
      <View
        key={note.id}
        style={[
          styles.noteCard,
          {
            backgroundColor: theme.colors.surface,
            shadowColor: theme.colors.shadow,
          },
        ]}
      >
        <View style={styles.noteHeader}>
          <Text style={[styles.noteTitle, { color: theme.colors.text }]} numberOfLines={2}>
            {note.title}
          </Text>
          <View style={styles.noteActions}>
            <TouchableOpacity
              onPress={() => onEditNote(note)}
              style={[styles.editButton, { backgroundColor: theme.colors.accent }]}
            >
              <Text style={[styles.editButtonText, { color: theme.colors.textInverse }]}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteNote(note.id)}
              style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
            >
              <Text style={[styles.deleteButtonText, { color: theme.colors.textInverse }]}>×</Text>
            </TouchableOpacity>
          </View>
        </View>

        {note.verse_reference && (
          <Text style={[styles.verseReference, { color: theme.colors.accent }]}>
            {note.verse_reference}
          </Text>
        )}

        <Text style={[styles.noteContent, { color: theme.colors.textSecondary }]} numberOfLines={3}>
          {note.content}
        </Text>

        {note.tags && note.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {note.tags.map((tag, index) => (
              <View
                key={index}
                style={[styles.tag, { backgroundColor: theme.colors.accentBackgroundSecondary }]}
              >
                <Text style={[styles.tagText, { color: theme.colors.accent }]}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={[styles.noteDate, { color: theme.colors.textPlaceholder }]}>
          {formatDate(note.updated_date)}
        </Text>
      </View>
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

      {loading && notes.length === 0 ? (
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
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.accent]}
            />
          }
        >
          {notes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>No notes yet</Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
                {verseReference
                  ? 'Tap the + button to add a note for this passage'
                  : 'Search for a Bible passage and start taking notes'}
              </Text>
            </View>
          ) : (
            <View style={styles.notesContainer}>{notes.map(renderNote)}</View>
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
  noteCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  noteActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  verseReference: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  noteDate: {
    fontSize: 12,
    textAlign: 'right',
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
