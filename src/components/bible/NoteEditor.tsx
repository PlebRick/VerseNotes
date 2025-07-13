import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BibleNoteData } from '../../entities';
import { useThemeContext } from '../../theme';
import { useNotes } from '../../context/NotesProvider';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import ButterButton from '../common/ButterButton';

// Web-compatible alert functions
const showAlert = (title: string, message: string, onOk?: () => void) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    if (onOk) onOk();
  } else {
    Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
  }
};

const showConfirm = (title: string, message: string, onConfirm: () => void) => {
  if (Platform.OS === 'web') {
    const result = window.confirm(`${title}\n\n${message}`);
    if (result) onConfirm();
  } else {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: onConfirm },
    ]);
  }
};

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
  const { addNote, updateNote } = useNotes(); // Use hook for CRUD operations
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [startVerse, setStartVerse] = useState('');
  const [endVerse, setEndVerse] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags.join(', '));
      setStartVerse(note.start_verse?.toString() || '');
      setEndVerse(note.end_verse?.toString() || '');
    } else if (verseReference) {
      setTitle(`Notes on ${verseReference}`);
      setContent(verseText ? `"${verseText}"\n\n` : '');
      setTags('');
      setStartVerse('');
      setEndVerse('');
    }
  }, [note, verseReference, verseText]);

  const handleSave = async () => {
    if (!title.trim()) {
      showAlert('Error', 'Please enter a title for your note');
      return;
    }

    if (!content.trim()) {
      showAlert('Error', 'Please enter some content for your note');
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
        savedNote = await updateNote(note.id, {
          title: title.trim(),
          content: content, // It's now HTML
          tags: tagArray,
          start_verse: startVerse ? parseInt(startVerse) : undefined,
          end_verse: endVerse ? parseInt(endVerse) : undefined,
        });
      } else {
        // Create new note
        savedNote = await addNote({
          title: title.trim(),
          content: content, // It's now HTML
          verse_reference: verseReference || '',
          tags: tagArray,
          start_verse: startVerse ? parseInt(startVerse) : undefined,
          end_verse: endVerse ? parseInt(endVerse) : undefined,
        });
      }

      onSave(savedNote);
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
      showAlert('Error', 'Failed to save note. Please try again.');
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    showConfirm('Discard Changes', 'Are you sure you want to discard your changes?', onClose);
  };

  if (!isVisible) {
    return null;
  }

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
      textAlign: 'center',
      marginHorizontal: 12,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    verseReference: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
    },
    verseIcon: {
      fontSize: 16,
      marginRight: 8,
    },
    verseReferenceText: {
      fontSize: 16,
      fontWeight: '600',
    },
    inputGroup: {
      marginBottom: 20,
    },
    contentGroup: {
      flex: 1,
      marginBottom: 20,
      minHeight: 0, // Allows flex to work properly
    },
    topRowContainer: {
      flexDirection: 'row',
      marginBottom: 20,
      alignItems: 'flex-end',
    },
    titleColumn: {
      flex: 3,
      marginRight: 16,
    },
    verseRangeColumn: {
      width: 120,
      marginRight: 24,
    },
    tagsColumn: {
      flex: 2,
    },
    titleInputCompact: {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 16,
    },
    tagsInputCompact: {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 16,
    },
    verseInputCompact: {
      width: 50,
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      marginHorizontal: 2,
      fontSize: 16,
      textAlign: 'center',
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
      flex: 1,
      textAlignVertical: 'top',
    },
    verseRangeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    verseInput: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      marginHorizontal: 4,
    },
    verseRangeDash: {
      fontSize: 16,
      paddingHorizontal: 8,
    },
    richToolbar: {
      height: 50,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    richEditorContainer: {
      borderWidth: 1,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      flex: 1,
    },
    richEditor: {
      padding: 12,
      fontSize: 16,
    },
  });

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
        <ButterButton title="Cancel" onPress={handleCancel} variant="ghost" size="medium" />
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {note ? 'Edit Note' : 'New Note'}
        </Text>
        <ButterButton
          title="Save"
          onPress={handleSave}
          variant="darkGray"
          size="medium"
          loading={isSaving}
          disabled={isSaving}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {verseReference && (
          <View
            style={[
              styles.verseReference,
              {
                backgroundColor: theme.colors.backgroundSecondary,
                borderColor: theme.colors.buttonDarkGray,
              },
            ]}
          >
            <Text style={[styles.verseIcon, { color: theme.colors.text }]}>📖</Text>
            <Text style={[styles.verseReferenceText, { color: theme.colors.text }]}>
              {verseReference}
            </Text>
          </View>
        )}

        {/* Horizontal row with Title, Verse Range, and Tags */}
        <View style={styles.topRowContainer}>
          <View style={styles.titleColumn}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Title</Text>
            <TextInput
              style={[
                styles.titleInputCompact,
                {
                  borderColor: theme.colors.buttonDarkGray,
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

          <View style={styles.verseRangeColumn}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Verse Range</Text>
            <View style={styles.verseRangeContainer}>
              <TextInput
                style={[
                  styles.verseInputCompact,
                  {
                    borderColor: theme.colors.buttonDarkGray,
                    color: theme.colors.text,
                    backgroundColor: theme.colors.backgroundSecondary,
                  },
                ]}
                value={startVerse}
                onChangeText={setStartVerse}
                placeholder="1"
                placeholderTextColor={theme.colors.textPlaceholder}
                keyboardType="number-pad"
              />
              <Text style={[styles.verseRangeDash, { color: theme.colors.textSecondary }]}>-</Text>
              <TextInput
                style={[
                  styles.verseInputCompact,
                  {
                    borderColor: theme.colors.buttonDarkGray,
                    color: theme.colors.text,
                    backgroundColor: theme.colors.backgroundSecondary,
                  },
                ]}
                value={endVerse}
                onChangeText={setEndVerse}
                placeholder="7"
                placeholderTextColor={theme.colors.textPlaceholder}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.tagsColumn}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Tags (comma separated)</Text>
            <TextInput
              style={[
                styles.tagsInputCompact,
                {
                  borderColor: theme.colors.buttonDarkGray,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.backgroundSecondary,
                },
              ]}
              value={tags}
              onChangeText={setTags}
              placeholder="study, devotion"
              placeholderTextColor={theme.colors.textPlaceholder}
              multiline={false}
            />
          </View>
        </View>

        <View style={styles.contentGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Content</Text>
          {Platform.OS === 'web' ? (
            // Web fallback: Use regular TextInput
            <TextInput
              style={[
                styles.contentInput,
                {
                  borderColor: theme.colors.buttonDarkGray,
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
          ) : (
            // Mobile: Use RichEditor
            <>
              <RichToolbar
                actions={[
                  actions.undo,
                  actions.redo,
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                  actions.checkboxList,
                ]}
                style={[styles.richToolbar, { backgroundColor: theme.colors.surface }]}
              />
              <ScrollView style={[styles.richEditorContainer, { borderColor: theme.colors.buttonDarkGray }]}>
                <RichEditor
                  initialContentHTML={content}
                  onChange={setContent}
                  placeholder="Write your thoughts, insights, and reflections..."
                  style={[styles.richEditor, { backgroundColor: theme.colors.backgroundSecondary }]}
                  editorStyle={{ color: theme.colors.text }}
                />
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default NoteEditor;
