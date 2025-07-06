import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  Text,
  Dimensions
} from 'react-native';
// @ts-ignore - No type definitions available for this package
import { DrawerLayoutAndroid } from 'react-native-drawer-layout-polyfill';
import { BiblePassage, BiblePassageData, BibleNoteData } from '../entities';
import BibleSearchBar from '../components/bible/BibleSearchBar';
import BibleColumn from '../components/bible/BibleColumn';
import NotesColumn from '../components/bible/NotesColumn';
import NoteEditor from '../components/bible/NoteEditor';

const { width } = Dimensions.get('window');

interface BibleStudyProps {
  navigation?: any;
}

const BibleStudy: React.FC<BibleStudyProps> = ({ navigation }) => {
  const [passage, setPassage] = useState<BiblePassageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerses, setSelectedVerses] = useState<string[]>([]);
  const [selectedVerseText, setSelectedVerseText] = useState('');
  const [isNoteEditorVisible, setIsNoteEditorVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<BibleNoteData | undefined>();
  const [notesRefreshTrigger, setNotesRefreshTrigger] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // API configuration - In production, store this securely
  const BIBLE_API_KEY = 'your-api-key-here'; // Replace with actual API key
  const DEFAULT_BIBLE_ID = 'de4e12af7f28f599-02'; // English Standard Version

  const handleSearch = async (reference: string) => {
    setLoading(true);
    setSearchQuery(reference);
    
    try {
      // Parse the reference to get passage ID
      const parsed = BiblePassage.parseReference(reference);
      if (!parsed) {
        Alert.alert('Error', 'Invalid Bible reference format');
        return;
      }

      // Convert parsed reference to passage ID format
      // This is a simplified conversion - in production, you'd want more robust book name mapping
      const bookMap: { [key: string]: string } = {
        'Genesis': 'GEN',
        'Exodus': 'EXO',
        'Matthew': 'MAT',
        'Mark': 'MRK',
        'Luke': 'LUK',
        'John': 'JHN',
        'Romans': 'ROM',
        'Corinthians': '1CO',
        '1 Corinthians': '1CO',
        '2 Corinthians': '2CO',
        'Galatians': 'GAL',
        'Ephesians': 'EPH',
        'Philippians': 'PHP',
        'Colossians': 'COL',
        'Thessalonians': '1TH',
        '1 Thessalonians': '1TH',
        '2 Thessalonians': '2TH',
        'Timothy': '1TI',
        '1 Timothy': '1TI',
        '2 Timothy': '2TI',
        'Titus': 'TIT',
        'Philemon': 'PHM',
        'Hebrews': 'HEB',
        'James': 'JAS',
        'Peter': '1PE',
        '1 Peter': '1PE',
        '2 Peter': '2PE',
        'Revelation': 'REV'
      };

      const bookId = bookMap[parsed.book] || parsed.book.toUpperCase();
      let passageId = `${bookId}.${parsed.chapter}`;
      
      if (parsed.startVerse) {
        passageId += `.${parsed.startVerse}`;
        if (parsed.endVerse && parsed.endVerse !== parsed.startVerse) {
          passageId += `-${bookId}.${parsed.chapter}.${parsed.endVerse}`;
        }
      }

      const passageData = await BiblePassage.fetchPassage(
        DEFAULT_BIBLE_ID,
        passageId,
        BIBLE_API_KEY
      );

      setPassage(passageData);
      setSelectedVerses([]);
      setSelectedVerseText('');
    } catch (error) {
      console.error('Error fetching passage:', error);
      Alert.alert(
        'Error',
        'Failed to load Bible passage. Please check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVersePress = (verseId: string, verseText: string) => {
    if (selectedVerses.includes(verseId)) {
      setSelectedVerses(selectedVerses.filter(id => id !== verseId));
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

  const handleSaveNote = (note: BibleNoteData) => {
    setNotesRefreshTrigger(prev => prev + 1);
    setSelectedVerses([]);
    setSelectedVerseText('');
  };

  const handleCloseNoteEditor = () => {
    setIsNoteEditorVisible(false);
    setEditingNote(undefined);
  };

  const renderDrawerContent = () => (
    <View style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Bible Study</Text>
        <TouchableOpacity
          onPress={() => setDrawerOpen(false)}
          style={styles.closeDrawerButton}
        >
          <Text style={styles.closeDrawerText}>×</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          setDrawerOpen(false);
          // Navigate to settings if navigation is available
          if (navigation?.navigate) {
            navigation.navigate('Settings');
          }
        }}
      >
        <Text style={styles.drawerItemText}>Settings</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          setDrawerOpen(false);
          Alert.alert('Info', 'Export functionality will be implemented in Settings');
        }}
      >
        <Text style={styles.drawerItemText}>Export Notes</Text>
      </TouchableOpacity>
    </View>
  );

  const isTablet = width > 768;
  const showBibleColumn = !isNoteEditorVisible || isTablet;

  return (
    <DrawerLayoutAndroid
      ref={(drawer: any) => {
        if (drawer && drawerOpen !== drawer.openDrawer) {
          if (drawerOpen) {
            drawer.openDrawer();
          } else {
            drawer.closeDrawer();
          }
        }
      }}
      drawerWidth={280}
      drawerPosition="left"
      renderNavigationView={renderDrawerContent}
      onDrawerClose={() => setDrawerOpen(false)}
      onDrawerOpen={() => setDrawerOpen(true)}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setDrawerOpen(true)}
            style={styles.menuButton}
          >
            <Text style={styles.menuButtonText}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bible Study</Text>
        </View>

        <BibleSearchBar
          onSearch={handleSearch}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.content}>
          {showBibleColumn && (
            <View style={[styles.column, isTablet ? styles.bibleColumn : styles.fullColumn]}>
              <BibleColumn
                passage={passage}
                loading={loading}
                onVersePress={handleVersePress}
                selectedVerses={selectedVerses}
                showVerseNumbers={true}
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

        <Modal
          visible={isNoteEditorVisible}
          animationType="slide"
          presentationStyle="fullScreen"
        >
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
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
  },
  menuButtonText: {
    fontSize: 18,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    flexDirection: width > 768 ? 'row' : 'column',
  },
  column: {
    backgroundColor: '#fff',
  },
  fullColumn: {
    flex: 1,
  },
  bibleColumn: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  notesColumn: {
    flex: 1,
  },
  mobileNotesContainer: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeDrawerButton: {
    padding: 8,
  },
  closeDrawerText: {
    fontSize: 24,
    color: '#666',
  },
  drawerItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default BibleStudy;