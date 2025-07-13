import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { FormattedPassage, Verse } from '../../entities/BiblePassage';
import { useThemeContext } from '../../theme';

interface BibleColumnProps {
  passage: FormattedPassage | null;
  loading?: boolean;
  onVersePress?: (verseId: string, verseText: string) => void;
  _selectedVerses?: string[];
  fontSize?: 'small' | 'medium' | 'large';
}

const BibleColumn: React.FC<BibleColumnProps> = ({
  passage,
  loading = false,
  onVersePress,
  _selectedVerses = [],
  fontSize = 'medium',
}) => {
  const { theme } = useThemeContext();

  const getFontSize = () => {
    switch (fontSize) {
      case 'small':
        return 14;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading passage...
        </Text>
      </View>
    );
  }

  if (!passage) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
          Search for a Bible passage to begin studying
        </Text>
        <Text style={[styles.emptySubtext, { color: theme.colors.textSubtle }]}>
          Try "Romans 1:1-16" or "John 3"
        </Text>
      </View>
    );
  }

  if (!passage.verses || passage.verses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
          Unable to load passage. Please check your reference or try again later.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border },
        ]}
      >
        <Text style={[styles.reference, { color: theme.colors.text }]}>{passage.reference}</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {passage.verses.map((verse: Verse, idx: number) => (
            <TouchableOpacity
              key={`${verse.book}-${verse.chapter}-${verse.verse}-${idx}`}
              style={styles.verseContainer}
              onPress={() =>
                onVersePress && onVersePress(`${verse.chapter}:${verse.verse}`, verse.text)
              }
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.verseText,
                  { fontSize: getFontSize(), color: theme.colors.textDark },
                ]}
              >
                [{verse.verse}] {verse.text}
              </Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  reference: {
    fontSize: 18,
    fontWeight: 'bold',
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
    // color handled by theme in JSX
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default BibleColumn;
