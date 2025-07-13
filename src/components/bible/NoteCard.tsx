import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, LayoutAnimation, Platform } from 'react-native';
import { BibleNoteData } from '../../entities/BibleNote';
import { useTheme } from '../../theme';
import ButterButton from '../common/ButterButton';

interface NoteCardProps {
  note: BibleNoteData;
  onEdit?: (note: BibleNoteData) => void;
  onDelete?: (id: string) => void;
  onView?: (note: BibleNoteData) => void;
  isExpanded?: boolean;
  onExpandToggle?: (noteId: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  onEdit, 
  onDelete, 
  onView,
  isExpanded = false,
  onExpandToggle 
}) => {
  const theme = useTheme();
  const rotationAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  // Configure layout animation for smooth expansion
  useEffect(() => {
    if (Platform.OS === 'android') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  }, [isExpanded]);

  // Animate triangle rotation
  useEffect(() => {
    Animated.timing(rotationAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, rotationAnim]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const getFullVerseReference = (note: BibleNoteData): string => {
    // If we have start_verse and end_verse, construct the full reference
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

  const handleEdit = () => {
    if (onEdit) {
      onEdit(note);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(note.id);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(note);
    }
  };

  const handleExpandToggle = () => {
    if (onExpandToggle) {
      onExpandToggle(note.id);
    }
  };

  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          ...theme.elevation.low,
        },
      ]}
    >
      {/* Header with verse reference, date, and actions */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Verse reference badge and date in same row */}
          <View style={styles.topRow}>
            {note.verse_reference && (
              <View
                style={[
                  styles.verseBadge,
                  {
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderColor: theme.colors.buttonDarkGray,
                  },
                ]}
              >
                <Text style={[styles.verseIcon, { color: theme.colors.text }]}>📖</Text>
                <Text style={[styles.verseText, { color: theme.colors.text }]}>
                  {getFullVerseReference(note)}
                </Text>
              </View>
            )}
            <Text style={[styles.date, { color: theme.colors.textMuted }]}>
              {formatDate(note.updated_date)}
            </Text>
          </View>
          
          {/* Title below verse reference and date */}
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
            {note.title}
          </Text>
        </View>
        
        {/* Reorganized action buttons: View + Edit + Delete */}
        <View style={styles.actions}>
          {onView && (
            <ButterButton
              title="View"
              onPress={handleView}
              variant="lightGray"
              size="small"
              style={styles.actionButton}
            />
          )}
          <ButterButton
            title="Edit"
            onPress={handleEdit}
            variant="lightGray"
            size="small"
            style={styles.actionButton}
          />
          {onDelete && (
            <ButterButton
              title="Delete"
              onPress={handleDelete}
              variant="lightGray"
              size="small"
              style={styles.actionButton}
            />
          )}
        </View>
      </View>

      {/* Content preview - Shows 5 lines when collapsed, full content when expanded */}
      <View style={styles.contentContainer}>
        <Text 
          style={[styles.preview, { color: theme.colors.textSecondary }]} 
          numberOfLines={isExpanded ? undefined : 5}
        >
          {stripHtmlTags(note.content)}
        </Text>
      </View>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {note.tags.slice(0, 3).map((tag, index) => (
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
              <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>#{tag}</Text>
            </View>
          ))}
          {note.tags.length > 3 && (
            <View
              style={[
                styles.tag,
                styles.moreTag,
                {
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text style={[styles.tagText, { color: theme.colors.textMuted }]}>
                +{note.tags.length - 3}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Expand/Collapse button in bottom-right corner */}
      {onExpandToggle && (
        <TouchableOpacity
          style={styles.expandButton}
          onPress={handleExpandToggle}
          activeOpacity={0.7}
        >
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <Text style={[styles.expandIcon, { color: theme.colors.textMuted }]}>▼</Text>
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    position: 'relative',
    // Shadow and elevation handled by theme
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  date: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.8,
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 6,
    minWidth: 45,
  },
  verseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  verseIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  verseText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  contentContainer: {
    marginBottom: 16,
  },
  preview: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 6,
    borderWidth: 1,
  },
  moreTag: {
    // Additional styling for the "+N" tag
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  expandButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  expandIcon: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NoteCard;
