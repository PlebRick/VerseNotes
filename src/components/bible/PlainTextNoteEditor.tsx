import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useThemeContext } from '../../theme';
import { BibleNoteData } from '../../entities/BibleNote';
import ButterButton from '../common/ButterButton';

interface PlainTextNoteEditorProps {
  note?: BibleNoteData;
  verseReference?: string;
  verseText?: string;
  isVisible: boolean;
  onClose: () => void;
  onSave: (note: BibleNoteData) => void;
}

const PlainTextNoteEditor: React.FC<PlainTextNoteEditorProps> = ({
  note,
  verseReference,
  verseText,
  isVisible,
  onClose,
  onSave,
}) => {
  const { theme } = useThemeContext();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  // Initialize form with note data or default values
  useEffect(() => {
    if (note) {
      // Editing existing note
      setTitle(note.title || '');
      setContent(note.content || '');
      setTags(note.tags?.join(', ') || '');
    } else {
      // Creating new note
      setTitle(verseReference || '');
      setContent(verseText ? `"${verseText}"\n\n` : '');
      setTags('');
    }
  }, [note, verseReference, verseText]);

  const handleSave = () => {
    console.log('🔸 PlainTextNoteEditor: handleSave called');
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your note.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content for your note.');
      return;
    }

    console.log('🔸 PlainTextNoteEditor: Creating note data');
    const now = new Date().toISOString();
    const noteData: BibleNoteData = {
      id: note?.id || `note_${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      verse_reference: verseReference || note?.verse_reference || '',
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      created_date: note?.created_date || now,
      updated_date: now,
    };

    console.log('🔸 PlainTextNoteEditor: Calling onSave with data:', noteData);
    onSave(noteData);
  };

  const handleCancel = () => {
    console.log('🔸 PlainTextNoteEditor: handleCancel called');
    Alert.alert('Discard Changes', 'Are you sure you want to discard your changes?', [
      { text: 'Continue Editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: onClose },
    ]);
  };

  if (!isVisible) return null;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {note ? 'Edit Note' : 'New Note'}
        </Text>
        <View style={styles.headerActions}>
          <ButterButton
            title="Cancel"
            onPress={handleCancel}
            variant="ghost"
            style={[styles.headerButton, { backgroundColor: 'red' }] as any}
          />
          <ButterButton
            title="Save"
            onPress={handleSave}
            variant="primary"
            style={[styles.headerButton, { backgroundColor: 'blue' }] as any}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Title Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Title</Text>
            <TextInput
              style={[
                styles.titleInput,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter note title..."
              placeholderTextColor={theme.colors.textSecondary}
              maxLength={100}
            />
          </View>

          {/* Content Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Content</Text>
            <TextInput
              style={[
                styles.contentInput,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={content}
              onChangeText={setContent}
              placeholder="Enter your note content..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
          </View>

          {/* Tags Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Tags</Text>
            <TextInput
              style={[
                styles.tagsInput,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={tags}
              onChangeText={setTags}
              placeholder="Enter tags separated by commas..."
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          {/* Verse Reference Display */}
          {(verseReference || note?.verse_reference) && (
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Bible Reference</Text>
              <View style={[styles.referenceDisplay, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.referenceText, { color: theme.colors.textSecondary }]}>
                  {verseReference || note?.verse_reference}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  contentInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 200,
  },
  tagsInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  referenceDisplay: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  referenceText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default PlainTextNoteEditor;
