import React, { useState } from 'react';
import { View, StyleSheet, Alert, Modal, Text, Dimensions } from 'react-native';
import { BiblePassage, FormattedPassage } from '../entities/BiblePassage';
import { BibleNoteData } from '../entities/BibleNote';
import BibleSearchBar from '../components/bible/BibleSearchBar';
import BibleColumn from '../components/bible/BibleColumn';
import NotesColumn from '../components/bible/NotesColumn';
import NoteEditor from '../components/bible/NoteEditor';
import { useThemeContext } from '../theme';

const { width } = Dimensions.get('window');

interface BibleStudyProps {
  _navigation?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const BibleStudy: React.FC<BibleStudyProps> = ({ _navigation }) => {
  const { theme } = useThemeContext();
  const [passage, setPassage] = useState<FormattedPassage | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerses, setSelectedVerses] = useState<string[]>([]);
  const [selectedVerseText, setSelectedVerseText] = useState('');
  const [isNoteEditorVisible, setIsNoteEditorVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<BibleNoteData | undefined>();
  const [notesRefreshTrigger, setNotesRefreshTrigger] = useState(0);

  const handleSearch = async (reference: string) => {
    setLoading(true);
    setSearchQuery(reference);
    try {
      const parsed = BiblePassage.parseReference(reference);
      if (!parsed) {
        Alert.alert('Error', 'Invalid Bible reference format');
        return;
      }
      const passageData = await BiblePassage.fetchPassage(parsed);
      setPassage(passageData);
      setSelectedVerses([]);
      setSelectedVerseText('');
    } catch (error) {
      console.error('Error fetching passage:', error);
      Alert.alert(
        'Error',
        'Failed to load Bible passage. Please check your internet connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVersePress = (verseId: string, verseText: string) => {
    if (selectedVerses.includes(verseId)) {
      setSelectedVerses(selectedVerses.filter((id) => id !== verseId));
      setSelectedVerseText('');
    } else {
      setSelectedVerses([...selectedVerses, verseId]);
      setSelectedVerseText(verseText);
    }
  };

  const handleAddNote = () => {
    setEditingNote(undefined);
    setIsNoteEditorVisible(true);
  };

  const handleEditNote = (note: BibleNoteData) => {
    setEditingNote(note);
    setIsNoteEditorVisible(true);
  };

  const handleSaveNote = (_note: BibleNoteData) => {
    setNotesRefreshTrigger((prev) => prev + 1);
    setSelectedVerses([]);
    setSelectedVerseText('');
  };

  const handleCloseNoteEditor = () => {
    setIsNoteEditorVisible(false);
    setEditingNote(undefined);
  };

  const isTablet = width > 768;
  const showBibleColumn = !isNoteEditorVisible || isTablet;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.backgroundSecondary }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Bible Study</Text>
      </View>

      <BibleSearchBar onSearch={handleSearch} value={searchQuery} onChangeText={setSearchQuery} />

      <View style={styles.content}>
        {showBibleColumn && (
          <View
            style={[
              styles.column,
              { backgroundColor: theme.colors.surface },
              isTablet
                ? [styles.bibleColumn, { borderRightColor: theme.colors.border }]
                : styles.fullColumn,
            ]}
          >
            <BibleColumn
              passage={passage}
              loading={loading}
              onVersePress={handleVersePress}
              _selectedVerses={selectedVerses}
              fontSize="medium"
            />
          </View>
        )}

        {isTablet && (
          <View style={styles.notesColumn}>
            <NotesColumn
              verseReference={passage?.reference}
              onAddNote={handleAddNote}
              onEditNote={handleEditNote}
              refreshTrigger={notesRefreshTrigger}
            />
          </View>
        )}
      </View>

      <Modal visible={isNoteEditorVisible} animationType="slide" presentationStyle="fullScreen">
        <NoteEditor
          note={editingNote}
          verseReference={selectedVerses.length > 0 ? passage?.reference : undefined}
          verseText={selectedVerseText}
          isVisible={isNoteEditorVisible}
          onClose={handleCloseNoteEditor}
          onSave={handleSaveNote}
        />
      </Modal>

      {!isTablet && !isNoteEditorVisible && (
        <View style={styles.mobileNotesContainer}>
          <NotesColumn
            verseReference={passage?.reference}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
            refreshTrigger={notesRefreshTrigger}
          />
        </View>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    flexDirection: width > 768 ? 'row' : 'column',
  },
  column: {
    // backgroundColor handled by theme in JSX
  },
  fullColumn: {
    flex: 1,
  },
  bibleColumn: {
    flex: 1,
    borderRightWidth: 1,
    // borderRightColor handled by theme in JSX
  },
  notesColumn: {
    flex: 1,
  },
  mobileNotesContainer: {
    flex: 1,
  },
});

export default BibleStudy;
