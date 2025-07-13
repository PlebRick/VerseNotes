import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Modal, Text, Dimensions, TouchableOpacity } from 'react-native';
import { BiblePassage, FormattedPassage } from '../entities/BiblePassage';
import { BibleNoteData } from '../entities/BibleNote';
import BibleSearchBar from '../components/bible/BibleSearchBar';
import BibleColumn from '../components/bible/BibleColumn';
import NotesColumn from '../components/bible/NotesColumn';
import NoteEditor from '../components/bible/NoteEditor';
import { useThemeContext } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Storage key for last searched passage
const LAST_PASSAGE_STORAGE_KEY = 'versenotes_last_passage';

interface BibleStudyProps {
  _navigation?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

type RootStackParamList = {
  BibleStudy: undefined;
  Settings: undefined;
};

const BibleStudy: React.FC<BibleStudyProps> = ({ _navigation }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); // Use navigation hook
  const { theme } = useThemeContext();
  const [passage, setPassage] = useState<FormattedPassage | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerses, setSelectedVerses] = useState<string[]>([]);
  const [selectedVerseText, setSelectedVerseText] = useState('');
  const [isNoteEditorVisible, setIsNoteEditorVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<BibleNoteData | undefined>();
  const [notesRefreshTrigger, setNotesRefreshTrigger] = useState(0);

  // Auto-restore last passage on component mount
  useEffect(() => {
    const restoreLastPassage = async () => {
      try {
        const savedData = await AsyncStorage.getItem(LAST_PASSAGE_STORAGE_KEY);
        if (savedData) {
          const { searchQuery: savedQuery, passage: savedPassage } = JSON.parse(savedData);
          setSearchQuery(savedQuery);
          setPassage(savedPassage);
        }
      } catch (error) {
        console.warn('Failed to restore last passage:', error);
      }
    };
    restoreLastPassage();
  }, []);

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

      // Save the search query and passage for persistence
      const dataToSave = {
        searchQuery: reference,
        passage: passageData,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(LAST_PASSAGE_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error fetching passage:', error);
      Alert.alert('Error', 'Failed to fetch passage. Please check your reference and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVersePress = (verseId: string, verseText: string) => {
    setSelectedVerses([verseId]);
    setSelectedVerseText(verseText);
    setIsNoteEditorVisible(true);
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
    setIsNoteEditorVisible(false);
  };

  const handleCloseNoteEditor = () => {
    setIsNoteEditorVisible(false);
    setEditingNote(undefined);
  };

  const isTablet = width > 768;
  const showBibleColumn = !isNoteEditorVisible || isTablet;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Simple Top Navigation Bar */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerContent}>
          <View style={styles.brandSection}>
            <Text style={[styles.logoIcon, { color: theme.colors.accent }]}>📖</Text>
            <View style={styles.titleSection}>
              <Text style={[styles.appTitle, { color: theme.colors.text }]}>VerseNotes</Text>
              <Text style={[styles.appSubtitle, { color: theme.colors.textSecondary }]}>
                A Bible study companion
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.settingsButton}
            accessibilityLabel="Settings"
            accessibilityRole="button"
          >
            <Text style={[styles.settingsIcon, { color: theme.colors.text }]}>⚙</Text>
            <Text style={[styles.settingsText, { color: theme.colors.text }]}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Two-Column Layout with Aligned Headers */}
      <View style={styles.content}>
        {showBibleColumn && (
          <View
            style={[
              styles.column,
              styles.bibleColumnContainer,
              { backgroundColor: theme.colors.surface },
              isTablet
                ? [styles.bibleColumn, { borderRightColor: theme.colors.border }]
                : styles.fullColumn,
            ]}
          >
            {/* Bible Search Bar - Only in Bible Column */}
            <View style={[
              styles.searchContainer, 
              { 
                backgroundColor: theme.colors.surface,
                borderBottomColor: theme.colors.border
              }
            ]}>
              <BibleSearchBar onSearch={handleSearch} value={searchQuery} onChangeText={setSearchQuery} />
            </View>
            
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
          <View style={[styles.notesColumn, styles.notesColumnContainer]}>
            {/* Study Notes Header aligned with Bible Search */}
            <View style={[
              styles.notesHeader, 
              { 
                backgroundColor: theme.colors.surface,
                borderBottomColor: theme.colors.border
              }
            ]}>
              <Text style={[styles.notesHeaderText, { color: theme.colors.text }]}>Study Notes</Text>
            </View>
            
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
          verseReference={passage?.reference}
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  titleSection: {
    flexDirection: 'column',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: -2,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  settingsIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  settingsText: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    flexDirection: width > 768 ? 'row' : 'column',
  },
  column: {
    // Base column styles
  },
  fullColumn: {
    flex: 1,
  },
  bibleColumnContainer: {
    // Enhanced bible column container
  },
  bibleColumn: {
    flex: 1,
    borderRightWidth: 1,
  },
  notesColumn: {
    flex: 1,
  },
  notesColumnContainer: {
    // Enhanced notes column container
  },
  notesHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  notesHeaderText: {
    fontSize: 18,
    fontWeight: '600',
  },
  mobileNotesContainer: {
    flex: 1,
  },
});

export default BibleStudy;
