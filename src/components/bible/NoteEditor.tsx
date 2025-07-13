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
  ActivityIndicator,
} from 'react-native';
import { BibleNote, BibleNoteData } from '../../entities';
import { useThemeContext } from '../../theme';
import VerseBracket from './VerseBracket';

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
  onSave,
}) => {
  const { theme } = useThemeContext();
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
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      let savedNote: BibleNoteData;

      if (note) {
        // Update existing note
        savedNote = await BibleNote.update(note.id, {
          title: title.trim(),
          content: content.trim(),
          tags: tagArray,
        });
      } else {
        // Create new note
        savedNote = await BibleNote.create({
          title: title.trim(),
          content: content.trim(),
          verse_reference: verseReference || '',
          tags: tagArray,
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
    Alert.alert('Discard Changes', 'Are you sure you want to discard your changes?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: onClose },
    ]);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.backgroundSecondary,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={[styles.cancelButtonText, { color: theme.colors.accent }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {note ? 'Edit Note' : 'New Note'}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          style={[
            styles.saveButton,
            { backgroundColor: theme.colors.accent },
            isSaving && [styles.saveButtonDisabled, { backgroundColor: theme.colors.disabled }],
          ]}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={theme.colors.textInverse} />
          ) : (
            <Text style={[styles.saveButtonText, { color: theme.colors.textInverse }]}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {verseReference && (
          <View
            style={[
              styles.verseReference,
              { backgroundColor: theme.colors.accentBackgroundSecondary },
            ]}
          >
            <VerseBracket />
            <Text style={[styles.verseReferenceText, { color: theme.colors.accent }]}>
              {verseReference}
            </Text>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Title</Text>
          <TextInput
            style={[
              styles.titleInput,
              {
                borderColor: theme.colors.border,
                color: theme.colors.text,
                backgroundColor: theme.colors.backgroundSecondary,
              },
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter note title"
            placeholderTextColor={theme.colors.textPlaceholder}
            multiline={false}
            maxLength={100}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Tags (comma separated)</Text>
          <TextInput
            style={[
              styles.tagsInput,
              {
                borderColor: theme.colors.border,
                color: theme.colors.text,
                backgroundColor: theme.colors.backgroundSecondary,
              },
            ]}
            value={tags}
            onChangeText={setTags}
            placeholder="study, devotion, prayer"
            placeholderTextColor={theme.colors.textPlaceholder}
            multiline={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Content</Text>
          <TextInput
            style={[
              styles.contentInput,
              {
                borderColor: theme.colors.border,
                color: theme.colors.text,
                backgroundColor: theme.colors.backgroundSecondary,
              },
            ]}
            value={content}
            onChangeText={setContent}
            placeholder="Write your thoughts, insights, and reflections..."
            placeholderTextColor={theme.colors.textPlaceholder}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    // backgroundColor handled by theme in JSX
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  verseReference: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  verseReferenceText: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputGroup: {
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
  tagsInput: {
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
});

export default NoteEditor;
