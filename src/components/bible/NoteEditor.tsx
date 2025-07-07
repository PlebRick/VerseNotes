import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { BibleNote, BibleNoteData } from '../../entities';

interface NoteEditorProps {
  note?: BibleNoteData;
  verseReference?: string;
  verseText?: string;
  isVisible: boolean;
  onClose: () => void;
  onSave: (note: BibleNoteData) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  verseReference,
  verseText,
  isVisible,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags.join(', '));
    } else if (verseReference) {
      setTitle(`Notes on ${verseReference}`);
      setContent(verseText ? `"${verseText}"\n\n` : '');
      setTags('');
    }
  }, [note, verseReference, verseText]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your note');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content for your note');
      return;
    }

    setIsSaving(true);
    try {
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      let savedNote: BibleNoteData;

      if (note) {
        // Update existing note
        savedNote = await BibleNote.update(note.id, {
          title: title.trim(),
          content: content.trim(),
          tags: tagArray
        });
      } else {
        // Create new note
        savedNote = await BibleNote.create({
          title: title.trim(),
          content: content.trim(),
          verse_reference: verseReference || '',
          tags: tagArray
        });
      }

      onSave(savedNote);
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note. Please try again.');
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: onClose }
      ]
    );
  };

  if (!isVisible) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {note ? 'Edit Note' : 'New Note'}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {verseReference && (
          <View style={styles.verseReference}>
            <Text style={styles.verseReferenceText}>{verseReference}</Text>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter note title"
            placeholderTextColor="#999"
            multiline={false}
            maxLength={100}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tags (comma separated)</Text>
          <TextInput
            style={styles.tagsInput}
            value={tags}
            onChangeText={setTags}
            placeholder="study, devotion, prayer"
            placeholderTextColor="#999"
            multiline={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="Write your thoughts, insights, and reflections..."
            placeholderTextColor="#999"
            multiline={true}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  verseReference: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  verseReferenceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  tagsInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
    minHeight: 200,
  },
});

export default NoteEditor;