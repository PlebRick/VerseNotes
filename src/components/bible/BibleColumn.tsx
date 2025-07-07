import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { FormattedPassage, Verse } from '../../entities/BiblePassage';

interface BibleColumnProps {
  passage: FormattedPassage | null;
  loading?: boolean;
  onVersePress?: (verseId: string, verseText: string) => void;
  selectedVerses?: string[];
  fontSize?: 'small' | 'medium' | 'large';
}

const BibleColumn: React.FC<BibleColumnProps> = ({
  passage,
  loading = false,
  onVersePress,
  selectedVerses = [],
  fontSize = 'medium',
}) => {
  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return 14;
      case 'large': return 18;
      default: return 16;
    }
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
          Try "Romans 1:1-16" or "John 3"
        </Text>
      </View>
    );
  }

  if (!passage.verses || passage.verses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Unable to load passage. Please check your reference or try again later.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.reference}>{passage.reference}</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {passage.verses.map((verse: Verse, idx: number) => (
            <TouchableOpacity
              key={`${verse.book}-${verse.chapter}-${verse.verse}-${idx}`}
              style={styles.verseContainer}
              onPress={() => onVersePress && onVersePress(`${verse.chapter}:${verse.verse}`, verse.text)}
              activeOpacity={0.7}
            >
              <Text style={[styles.verseText, { fontSize: getFontSize() }]}>[{verse.verse}] {verse.text}</Text>
            </TouchableOpacity>
          ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  reference: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  verseContainer: {
    marginBottom: 8,
  },
  verseText: {
    color: '#222',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default BibleColumn;