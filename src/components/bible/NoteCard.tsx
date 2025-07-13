import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BibleNoteData } from '../../entities/BibleNote';
import { useTheme } from '../../theme';

import VerseBracket from './VerseBracket';

interface NoteCardProps {
  note: BibleNoteData;
  onEdit?: (note: BibleNoteData) => void;
  onDelete?: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit: _onEdit, onDelete: _onDelete }) => {
  const theme = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
          {note.title}
        </Text>
        <View style={styles.actions}>
          <Text style={[styles.date, { color: theme.colors.textMuted }]}>
            {formatDate(note.updated_date)}
          </Text>
        </View>
      </View>

      {note.verse_reference && (
        <View style={styles.verseBadge}>
          <VerseBracket />
          <Text style={[styles.verseText, { color: theme.colors.accent }]}>
            {note.verse_reference}
          </Text>
        </View>
      )}

      <Text style={[styles.preview, { color: theme.colors.textSecondary }]} numberOfLines={2}>
        {note.content}
      </Text>

      {note.tags && note.tags.length > 0 && (
        <View style={styles.tags}>
          {note.tags.map((tag, index) => (
            <View
              key={index}
              style={[styles.tag, { backgroundColor: theme.colors.surfaceElevated }]}
            >
              <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
  },
  verseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  verseText: {
    fontSize: 14,
    marginLeft: 8,
  },
  preview: {
    fontSize: 14,
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
  },
});

export default NoteCard;
