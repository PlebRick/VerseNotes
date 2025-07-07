import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { BibleNote, BibleNoteData } from '../../entities';

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
  refreshTrigger
}) => {
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
        ? allNotes.filter(note => note.verse_reference === verseReference)
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
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
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
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderNote = (note: BibleNoteData) => {
    return (
      <View key={note.id} style={styles.noteCard}>
        <View style={styles.noteHeader}>
          <Text style={styles.noteTitle} numberOfLines={2}>
            {note.title}
          </Text>
          <View style={styles.noteActions}>
            <TouchableOpacity
              onPress={() => onEditNote(note)}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteNote(note.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {note.verse_reference && (
          <Text style={styles.verseReference}>{note.verse_reference}</Text>
        )}
        
        <Text style={styles.noteContent} numberOfLines={3}>
          {note.content}
        </Text>
        
        {note.tags && note.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {note.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
        
        <Text style={styles.noteDate}>
          {formatDate(note.updated_date)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {verseReference ? `Notes for ${verseReference}` : 'All Notes'}
        </Text>
        <TouchableOpacity
          onPress={onAddNote}
          style={styles.addButton}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {loading && notes.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading notes...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007AFF']}
            />
          }
        >
          {notes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No notes yet</Text>
              <Text style={styles.emptySubtext}>
                {verseReference
                  ? 'Tap the + button to add a note for this passage'
                  : 'Search for a Bible passage and start taking notes'}
              </Text>
            </View>
          ) : (
            <View style={styles.notesContainer}>
              {notes.map(renderNote)}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
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
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  noteActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  verseReference: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
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
    color: '#666',
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
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default NotesColumn;