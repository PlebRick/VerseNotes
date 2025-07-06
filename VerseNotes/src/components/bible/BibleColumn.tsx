import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { BiblePassageData } from '../../entities';

interface BibleColumnProps {
  passage: BiblePassageData | null;
  loading?: boolean;
  onVersePress?: (verseId: string, verseText: string) => void;
  selectedVerses?: string[];
  fontSize?: 'small' | 'medium' | 'large';
  showVerseNumbers?: boolean;
}

const BibleColumn: React.FC<BibleColumnProps> = ({
  passage,
  loading = false,
  onVersePress,
  selectedVerses = [],
  fontSize = 'medium',
  showVerseNumbers = true
}) => {
  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return 14;
      case 'large': return 18;
      default: return 16;
    }
  };

  const parseContent = (content: string) => {
    // Parse HTML content from API and extract verses
    // This is a simplified parser - in production, you might want to use a proper HTML parser
    const verses: { id: string; number: string; text: string }[] = [];
    
    // Remove HTML tags and extract verse numbers
    const cleanContent = content.replace(/<[^>]*>/g, '');
    
    // Split by verse numbers (assuming format like "1 In the beginning...")
    const versePattern = /(\d+)\s+([^0-9]+?)(?=\d+\s+|$)/g;
    let match;
    
    while ((match = versePattern.exec(cleanContent)) !== null) {
      const [, number, text] = match;
      verses.push({
        id: `${passage?.id}-${number}`,
        number,
        text: text.trim()
      });
    }
    
    // If no verses found, treat entire content as one verse
    if (verses.length === 0 && cleanContent.trim()) {
      verses.push({
        id: passage?.id || 'unknown',
        number: '1',
        text: cleanContent.trim()
      });
    }
    
    return verses;
  };

  const handleVersePress = (verseId: string, verseText: string) => {
    if (onVersePress) {
      onVersePress(verseId, verseText);
    }
  };

  const renderVerse = (verse: { id: string; number: string; text: string }) => {
    const isSelected = selectedVerses.includes(verse.id);
    
    return (
      <TouchableOpacity
        key={verse.id}
        style={[styles.verseContainer, isSelected && styles.selectedVerse]}
        onPress={() => handleVersePress(verse.id, verse.text)}
        activeOpacity={0.7}
      >
        <View style={styles.verseContent}>
          {showVerseNumbers && (
            <Text style={[styles.verseNumber, { fontSize: getFontSize() - 2 }]}>
              {verse.number}
            </Text>
          )}
          <Text style={[styles.verseText, { fontSize: getFontSize() }]}>
            {verse.text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading passage...</Text>
      </View>
    );
  }

  if (!passage) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Search for a Bible passage to begin studying
        </Text>
        <Text style={styles.emptySubtext}>
          Try "Romans 1:1-16" or "John 3:16"
        </Text>
      </View>
    );
  }

  const verses = parseContent(passage.content);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.reference}>{passage.reference}</Text>
        {passage.copyright && (
          <Text style={styles.copyright}>{passage.copyright}</Text>
        )}
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {verses.map(renderVerse)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  reference: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  verseContainer: {
    marginBottom: 12,
    padding: 8,
    borderRadius: 6,
  },
  selectedVerse: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  verseContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  verseNumber: {
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 8,
    minWidth: 20,
    textAlign: 'right',
  },
  verseText: {
    flex: 1,
    color: '#333',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
    padding: 32,
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

export default BibleColumn;