import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { BibleNoteData } from '../../entities/BibleNote';
import { BiblePassage, FormattedPassage } from '../../entities/BiblePassage';
import { useTheme } from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NoteReaderProps {
  note: BibleNoteData;
  onClose: () => void;
  isVisible: boolean;
}

const FONT_SIZE_STORAGE_KEY = 'versenotes_reader_font_size';
const DEFAULT_FONT_SIZE = 18; // Increased default for better readability
const MIN_FONT_SIZE = 14; // Increased minimum for public speaking
const MAX_FONT_SIZE = 32; // Increased maximum for podium reading
const FONT_SIZE_STEP = 2; // Size increment step

const NoteReader: React.FC<NoteReaderProps> = ({ note, onClose, isVisible }) => {
  const theme = useTheme();
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [biblePassage, setBiblePassage] = useState<FormattedPassage | null>(null);
  const [loadingBible, setLoadingBible] = useState(true);
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));

  // Track orientation changes for better public speaking layout
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const isLandscape = screenDimensions.width > screenDimensions.height;

  // Load saved font size on mount
  useEffect(() => {
    const loadFontSize = async () => {
      try {
        const savedSize = await AsyncStorage.getItem(FONT_SIZE_STORAGE_KEY);
        if (savedSize) {
          setFontSize(parseInt(savedSize, 10));
        }
      } catch (error) {
        console.warn('Failed to load font size:', error);
      }
    };
    loadFontSize();
  }, []);

  // Fetch Bible verses when note changes
  useEffect(() => {
    if (!isVisible || !note.verse_reference) return;

    const fetchBibleVerses = async () => {
      setLoadingBible(true);
      try {
        // Construct the full verse reference for API call
        let verseReference = note.verse_reference;
        if (note.start_verse && note.end_verse) {
          if (note.start_verse === note.end_verse) {
            verseReference = `${note.verse_reference}:${note.start_verse}`;
          } else {
            verseReference = `${note.verse_reference}:${note.start_verse}-${note.end_verse}`;
          }
        } else if (note.start_verse) {
          verseReference = `${note.verse_reference}:${note.start_verse}`;
        }

        const passage = await BiblePassage.fetchPassage(verseReference);
        setBiblePassage(passage);
      } catch (error) {
        console.error('Error fetching Bible verses:', error);
        setBiblePassage(null);
        // Don't show alert for Bible fetch errors, just log them
      } finally {
        setLoadingBible(false);
      }
    };

    fetchBibleVerses();
  }, [note, isVisible]);

  // Save font size when it changes
  useEffect(() => {
    const saveFontSize = async () => {
      try {
        await AsyncStorage.setItem(FONT_SIZE_STORAGE_KEY, fontSize.toString());
      } catch (error) {
        console.warn('Failed to save font size:', error);
      }
    };
    saveFontSize();
  }, [fontSize]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getFullVerseReference = (): string => {
    if (note.start_verse && note.end_verse) {
      if (note.start_verse === note.end_verse) {
        return `${note.verse_reference}:${note.start_verse}`;
      } else {
        return `${note.verse_reference}:${note.start_verse}-${note.end_verse}`;
      }
    } else if (note.start_verse) {
      return `${note.verse_reference}:${note.start_verse}`;
    } else {
      return note.verse_reference;
    }
  };

  const increaseFontSize = () => {
    if (fontSize < MAX_FONT_SIZE) {
      setFontSize(fontSize + FONT_SIZE_STEP);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > MIN_FONT_SIZE) {
      setFontSize(fontSize - FONT_SIZE_STEP);
    }
  };

  if (!isVisible) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header with back arrow and font controls */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={onClose} activeOpacity={0.7}>
          <Text style={[styles.backArrow, { color: theme.colors.text }]}>←</Text>
          <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>

        {/* Font size controls */}
        <View style={styles.fontControls}>
          <TouchableOpacity
            style={[
              styles.fontButton,
              {
                backgroundColor: theme.colors.backgroundSecondary,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={decreaseFontSize}
            disabled={fontSize <= MIN_FONT_SIZE}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.fontButtonText,
                { color: fontSize <= MIN_FONT_SIZE ? theme.colors.textMuted : theme.colors.text },
              ]}
            >
              A-
            </Text>
          </TouchableOpacity>
          <Text style={[styles.fontSizeDisplay, { color: theme.colors.textSecondary }]}>
            {fontSize}px
          </Text>
          <TouchableOpacity
            style={[
              styles.fontButton,
              {
                backgroundColor: theme.colors.backgroundSecondary,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={increaseFontSize}
            disabled={fontSize >= MAX_FONT_SIZE}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.fontButtonText,
                { color: fontSize >= MAX_FONT_SIZE ? theme.colors.textMuted : theme.colors.text },
              ]}
            >
              A+
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: isLandscape ? 40 : 20, // More padding in landscape for better presentation
            paddingVertical: isLandscape ? 30 : 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Note title */}
        <Text style={[styles.title, { color: theme.colors.text, fontSize: fontSize + 4 }]}>
          {note.title}
        </Text>

        {/* Book and verse range */}
        <Text
          style={[styles.verseReference, { color: theme.colors.textSecondary, fontSize: fontSize }]}
        >
          {getFullVerseReference()}
        </Text>

        {/* Date and tags */}
        <View style={styles.metadataContainer}>
          <Text style={[styles.date, { color: theme.colors.textMuted, fontSize: fontSize - 2 }]}>
            {formatDate(note.updated_date)}
          </Text>
          {note.tags && note.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {note.tags.map((tag, index) => (
                <View
                  key={index}
                  style={[
                    styles.tag,
                    {
                      backgroundColor: theme.colors.backgroundSecondary,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: theme.colors.textSecondary, fontSize: fontSize - 4 },
                    ]}
                  >
                    #{tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Bible verses section */}
        <View
          style={[
            styles.bibleSection,
            { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border },
          ]}
        >
          <Text
            style={[styles.bibleSectionTitle, { color: theme.colors.text, fontSize: fontSize }]}
          >
            Scripture Text
          </Text>
          {loadingBible ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.accent} />
              <Text
                style={[
                  styles.loadingText,
                  { color: theme.colors.textSecondary, fontSize: fontSize - 2 },
                ]}
              >
                Loading verses...
              </Text>
            </View>
          ) : biblePassage && biblePassage.verses ? (
            <View style={styles.versesContainer}>
              {biblePassage.verses.map((verse, index) => (
                <View key={index} style={styles.verseContainer}>
                  <Text
                    style={[
                      styles.verseNumber,
                      {
                        color: theme.colors.textSecondary,
                        fontSize: fontSize,
                        minWidth: Math.max(40, fontSize * 2.5), // Responsive width based on font size
                      },
                    ]}
                  >
                    [{verse.verse}]
                  </Text>
                  <Text
                    style={[styles.verseText, { color: theme.colors.textDark, fontSize: fontSize }]}
                  >
                    {verse.text}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text
              style={[styles.errorText, { color: theme.colors.textMuted, fontSize: fontSize - 2 }]}
            >
              Unable to load Bible verses for this reference.
            </Text>
          )}
        </View>

        {/* Full note content */}
        <View style={styles.noteContentSection}>
          <Text style={[styles.noteContentTitle, { color: theme.colors.text, fontSize: fontSize }]}>
            Study Notes
          </Text>
          <Text
            style={[
              styles.noteContent,
              { color: theme.colors.textDark, fontSize: fontSize, lineHeight: fontSize * 1.4 },
            ]}
          >
            {note.content}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backArrow: {
    fontSize: 24,
    fontWeight: '600',
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  fontControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  fontButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fontSizeDisplay: {
    fontSize: 12,
    fontWeight: '500',
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    // Padding now handled responsively based on orientation
  },
  title: {
    fontWeight: '700',
    lineHeight: 1.3, // Improved line height for readability
    marginBottom: 16, // Increased spacing
  },
  verseReference: {
    fontWeight: '600',
    marginBottom: 20, // Increased spacing
  },
  metadataContainer: {
    marginBottom: 28, // Increased spacing
  },
  date: {
    marginBottom: 12, // Increased spacing
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 12, // Slightly larger padding
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 6,
    borderWidth: 1,
  },
  tagText: {
    fontWeight: '500',
  },
  bibleSection: {
    padding: 20, // Increased padding for better spacing
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 28, // Increased spacing
  },
  bibleSectionTitle: {
    fontWeight: '600',
    marginBottom: 16, // Increased spacing
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
  },
  versesContainer: {
    // No additional styling needed
  },
  verseContainer: {
    flexDirection: 'row',
    marginBottom: 20, // Increased spacing between verses for better readability
    alignItems: 'flex-start', // Align verse number to top for multi-line verses
  },
  verseText: {
    flex: 1, // Take remaining space
    lineHeight: 1.6, // Better line height for readability
    marginLeft: 8, // Space between verse number and text
  },
  verseNumber: {
    fontWeight: '600',
    textAlign: 'left',
  },
  errorText: {
    fontStyle: 'italic',
  },
  noteContentSection: {
    marginBottom: 50, // Extra bottom padding for comfortable reading
  },
  noteContentTitle: {
    fontWeight: '600',
    marginBottom: 20, // Increased spacing
  },
  noteContent: {
    lineHeight: 1.6, // Improved line height for public speaking readability
  },
});

export default NoteReader;
