import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, Platform, TouchableOpacity } from 'react-native';
import { User, UserSettings } from '../entities/User';
import { useThemeContext, useColorSchemeFromContext } from '../theme';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useNotes } from '../context/NotesProvider';
import ButterButton from '../components/common/ButterButton';
import { BibleNoteData } from '../entities/BibleNote';
import { BiblePassage } from '../entities/BiblePassage';

interface SettingsProps {
  navigation?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// Backup data structure interface
interface BackupData {
  backup_info: {
    version: string;
    app_version: string;
    created_date: string;
    platform: string;
    notes_count: number;
  };
  user_data: {
    id: string;
    name: string;
    email: string;
    settings: UserSettings;
    created_date: string;
    updated_date: string;
  };
  notes: BibleNoteData[];
  checksum: {
    notes_hash: string;
    settings_hash: string;
  };
}

const Settings: React.FC<SettingsProps> = ({ navigation }) => {
  const { theme } = useThemeContext();
  const scheme = useColorSchemeFromContext(); // Use context-based colorScheme
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [_unusedUserVar, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [settings, setSettings] = useState<UserSettings>({
    default_translation: 'WEB',
    font_size: 'medium',
    theme: 'light',
    auto_save: true,
    verse_numbers: true,
    paragraph_breaks: true,
    notifications: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'markdown' | 'text'>('json');
  const { notes, addNote, updateNote, deleteNote } = useNotes(); // Get notes context with methods

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (currentUser.settings) {
        setSettings({ ...settings, ...currentUser.settings });
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData({ settings });
      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
    setIsSaving(false);
  };

  const handleSettingChange = (key: keyof UserSettings, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Validate backup data structure
  const validateBackupData = (data: any): data is BackupData => {
    if (!data || typeof data !== 'object') return false;
    
    // Check required top-level properties
    if (!data.backup_info || !data.user_data || !data.notes || !Array.isArray(data.notes)) {
      return false;
    }

    // Validate backup info
    const backupInfo = data.backup_info;
    if (!backupInfo.version || !backupInfo.created_date || typeof backupInfo.notes_count !== 'number') {
      return false;
    }

    // Validate user data
    const userData = data.user_data;
    if (!userData.id || !userData.settings || typeof userData.settings !== 'object') {
      return false;
    }

    // Validate notes structure
    for (const note of data.notes) {
      if (!note.id || !note.title || !note.content || !note.verse_reference || 
          !note.created_date || !note.updated_date || !Array.isArray(note.tags)) {
        return false;
      }
    }

    return true;
  };

  // Enhanced restore function with conflict resolution
  const restoreBackupData = async (backupData: BackupData, mode: 'replace' | 'merge' = 'replace') => {
    try {
      let importedCount = 0;
      let skippedCount = 0;

      if (mode === 'replace') {
        // Clear existing notes first (full restore)
        const existingNotes = notes;
        for (const note of existingNotes) {
          await deleteNote(note.id);
        }

        // Restore user settings
        await User.updateMyUserData({
          settings: backupData.user_data.settings,
          name: backupData.user_data.name,
          email: backupData.user_data.email,
        });

        // Restore all notes
        for (const noteData of backupData.notes) {
          const noteToAdd = {
            title: noteData.title,
            content: noteData.content,
            verse_reference: noteData.verse_reference,
            start_verse: noteData.start_verse,
            end_verse: noteData.end_verse,
            tags: noteData.tags,
          };

          await addNote(noteToAdd);
          importedCount++;
        }
      } else if (mode === 'merge') {
        // Merge mode - only add new notes, skip duplicates
        const existingNoteIds = new Set(notes.map(note => note.id));

        for (const noteData of backupData.notes) {
          if (existingNoteIds.has(noteData.id)) {
            skippedCount++;
            continue;
          }

          const noteToAdd = {
            title: noteData.title,
            content: noteData.content,
            verse_reference: noteData.verse_reference,
            start_verse: noteData.start_verse,
            end_verse: noteData.end_verse,
            tags: noteData.tags,
          };

          await addNote(noteToAdd);
          importedCount++;
        }

        // In merge mode, don't overwrite user settings
        // Just show what would be different
        const currentSettings = await User.me();
        const settingsChanged = JSON.stringify(currentSettings.settings) !== JSON.stringify(backupData.user_data.settings);
        
        if (settingsChanged) {
          Alert.alert(
            'Settings Notice',
            'The backup contains different user settings. Your current settings have been preserved. Would you like to apply the imported settings?',
            [
              { text: 'Keep Current', style: 'cancel' },
              { 
                text: 'Apply Imported', 
                onPress: async () => {
                  await User.updateMyUserData({
                    settings: backupData.user_data.settings,
                  });
                  await loadUserSettings();
                }
              }
            ]
          );
        }
      }

      // Reload settings to reflect any changes
      await loadUserSettings();

      return { importedCount, skippedCount };
    } catch (error) {
      console.error('Error restoring backup data:', error);
      throw new Error('Failed to restore backup data');
    }
  };

  // Handle file import for web platform
  const handleWebFileImport = (mode: 'replace' | 'merge' = 'replace') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (event: any) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          
          if (validateBackupData(data)) {
            const result = await restoreBackupData(data, mode);
            const modeText = mode === 'replace' ? 'replaced' : 'merged';
            let message = `Backup ${modeText} successfully!\n\n• ${result.importedCount} notes imported`;
            
            if (result.skippedCount > 0) {
              message += `\n• ${result.skippedCount} notes skipped (duplicates)`;
            }
            
            if (mode === 'replace') {
              message += '\n• User settings restored';
            }
            
            Alert.alert('Success', message);
          } else {
            Alert.alert('Error', 'Invalid backup file format. Please select a valid VerseNotes backup file.');
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to read backup file. Please check the file format.');
        }
      }
    };
    input.click();
  };

  // Handle file import for mobile platforms
  const handleMobileFileImport = async (mode: 'replace' | 'merge' = 'replace') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
        const data = JSON.parse(fileContent);
        
        if (validateBackupData(data)) {
          const importResult = await restoreBackupData(data, mode);
          const modeText = mode === 'replace' ? 'replaced' : 'merged';
          let message = `Backup ${modeText} successfully!\n\n• ${importResult.importedCount} notes imported`;
          
          if (importResult.skippedCount > 0) {
            message += `\n• ${importResult.skippedCount} notes skipped (duplicates)`;
          }
          
          if (mode === 'replace') {
            message += '\n• User settings restored';
          }
          
          Alert.alert('Success', message);
        } else {
          Alert.alert('Error', 'Invalid backup file format. Please select a valid VerseNotes backup file.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to import backup file. Please try again.');
    }
  };

  const handleImportNotes = async () => {
    setIsImporting(true);
    try {
      // Show import options dialog
      Alert.alert(
        'Import Backup',
        `You currently have ${notes.length} notes. How would you like to import the backup?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Replace All', 
            style: 'destructive',
            onPress: async () => {
              Alert.alert(
                'Confirm Replace',
                'This will DELETE all existing notes and replace them with the imported data. This action cannot be undone.\n\nAre you sure?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Replace All', 
                    style: 'destructive',
                    onPress: async () => {
                      if (Platform.OS === 'web') {
                        handleWebFileImport('replace');
                      } else {
                        await handleMobileFileImport('replace');
                      }
                    }
                  }
                ]
              );
            }
          },
          { 
            text: 'Merge', 
            style: 'default',
            onPress: async () => {
              Alert.alert(
                'Merge Import',
                'This will add the imported notes to your existing notes. Duplicate notes (same ID) will be skipped.\n\nContinue?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Merge', 
                    style: 'default',
                    onPress: async () => {
                      if (Platform.OS === 'web') {
                        handleWebFileImport('merge');
                      } else {
                        await handleMobileFileImport('merge');
                      }
                    }
                  }
                ]
              );
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error importing notes:', error);
      Alert.alert('Error', 'Failed to import backup file.');
    }
    setIsImporting(false);
  };

  // Enhanced JSON export structure for complete backup
  const createBackupData = async () => {
    try {
      // Get current user data and settings
      const userData = await User.me();
      
      // Create comprehensive backup structure
      const backupData = {
        // Backup metadata
        backup_info: {
          version: '1.0.0',
          app_version: '0.2.1',
          created_date: new Date().toISOString(),
          platform: Platform.OS,
          notes_count: notes.length,
        },
        // User data and settings
        user_data: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          settings: userData.settings,
          created_date: userData.created_date,
          updated_date: userData.updated_date,
        },
        // All notes data
        notes: notes.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content,
          verse_reference: note.verse_reference,
          start_verse: note.start_verse,
          end_verse: note.end_verse,
          tags: note.tags,
          created_date: note.created_date,
          updated_date: note.updated_date,
        })),
        // Additional metadata for validation
        checksum: {
          notes_hash: btoa(JSON.stringify(notes.map(n => n.id).sort())),
          settings_hash: btoa(JSON.stringify(userData.settings)),
        }
      };

      return backupData;
    } catch (error) {
      console.error('Error creating backup data:', error);
      throw new Error('Failed to create backup data');
    }
  };

  // Generate Markdown export content
  const generateMarkdownExport = async () => {
    try {
      const userData = await User.me();
      const timestamp = new Date().toISOString().split('T')[0];
      
      let markdown = `# VerseNotes Export\n\n`;
      markdown += `**Export Date:** ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}\n`;
      markdown += `**Notes Count:** ${notes.length}\n`;
      markdown += `**Translation:** WEB (World English Bible)\n\n`;
      
      markdown += `---\n\n`;
      
      // Sort notes by creation date (newest first)
      const sortedNotes = [...notes].sort((a, b) => 
        new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
      );
      
      for (const note of sortedNotes) {
        // Note title as main heading
        markdown += `# ${note.title}\n\n`;
        
        // Verse reference and metadata
        const fullReference = note.start_verse && note.end_verse 
          ? (note.start_verse === note.end_verse 
              ? `${note.verse_reference}:${note.start_verse}`
              : `${note.verse_reference}:${note.start_verse}-${note.end_verse}`)
          : note.verse_reference;
        
        markdown += `**Scripture:** ${fullReference}  \n`;
        markdown += `**Date:** ${new Date(note.updated_date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}  \n`;
        
        // Tags
        if (note.tags && note.tags.length > 0) {
          markdown += `**Tags:** ${note.tags.map(tag => `#${tag}`).join(', ')}  \n`;
        }
        
        markdown += `\n`;
        
        // Try to fetch Bible verses for this note
        try {
          const verseReference = fullReference;
          const biblePassage = await BiblePassage.fetchPassage(verseReference);
          
          if (biblePassage && biblePassage.verses && biblePassage.verses.length > 0) {
            markdown += `## Scripture Text\n\n`;
            
            for (const verse of biblePassage.verses) {
              markdown += `**[${verse.verse}]** ${verse.text}\n\n`;
            }
          }
        } catch (error) {
          console.warn('Could not fetch Bible verses for markdown export:', error);
          markdown += `## Scripture Text\n\n`;
          markdown += `*Bible verses could not be loaded for ${fullReference}*\n\n`;
        }
        
        // Note content
        markdown += `## Study Notes\n\n`;
        
        // Convert HTML content to readable markdown
        const formattedContent = formatContentForMarkdown(note.content);
        markdown += `${formattedContent}\n\n`;
        
        markdown += `---\n\n`;
      }
      
      // Footer
      markdown += `*Generated by VerseNotes v0.2.1*\n`;
      markdown += `*${notes.length} notes exported on ${timestamp}*\n`;
      
      return markdown;
    } catch (error) {
      console.error('Error generating markdown export:', error);
      throw new Error('Failed to generate markdown export');
    }
  };

  // Format HTML content for Markdown export
  const formatContentForMarkdown = (html: string): string => {
    let markdown = html
      // Convert paragraph tags to double line breaks
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<p[^>]*>/gi, '')
      // Convert line breaks
      .replace(/<br\s*\/?>/gi, '\n')
      // Convert headings
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
      // Convert bold and italic
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      // Convert lists
      .replace(/<ul[^>]*>/gi, '')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<ol[^>]*>/gi, '')
      .replace(/<\/ol>/gi, '\n')
      .replace(/<li[^>]*>/gi, '- ')
      .replace(/<\/li>/gi, '\n')
      // Convert blockquotes
      .replace(/<blockquote[^>]*>/gi, '> ')
      .replace(/<\/blockquote>/gi, '\n')
      // Remove all other HTML tags
      .replace(/<[^>]*>/g, '')
      // Clean up extra whitespace
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple line breaks to double
      .replace(/\n\s+/g, '\n') // Remove spaces after line breaks
      .trim();

    return markdown;
  };

  // Generate Plain Text export content
  const generatePlainTextExport = async () => {
    try {
      const userData = await User.me();
      const timestamp = new Date().toISOString().split('T')[0];
      
      let plainText = `VERSENOTES EXPORT\n`;
      plainText += `${'='.repeat(50)}\n\n`;
      
      plainText += `Export Date: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}\n`;
      plainText += `Notes Count: ${notes.length}\n`;
      plainText += `Translation: WEB (World English Bible)\n\n`;
      
      plainText += `${'='.repeat(50)}\n\n`;
      
      // Sort notes by creation date (newest first)
      const sortedNotes = [...notes].sort((a, b) => 
        new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
      );
      
      for (let i = 0; i < sortedNotes.length; i++) {
        const note = sortedNotes[i];
        
        // Note title
        plainText += `${i + 1}. ${note.title.toUpperCase()}\n`;
        plainText += `${'-'.repeat(note.title.length + 4)}\n\n`;
        
        // Verse reference and metadata
        const fullReference = note.start_verse && note.end_verse 
          ? (note.start_verse === note.end_verse 
              ? `${note.verse_reference}:${note.start_verse}`
              : `${note.verse_reference}:${note.start_verse}-${note.end_verse}`)
          : note.verse_reference;
        
        plainText += `Scripture: ${fullReference}\n`;
        plainText += `Date: ${new Date(note.updated_date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}\n`;
        
        // Tags
        if (note.tags && note.tags.length > 0) {
          plainText += `Tags: ${note.tags.join(', ')}\n`;
        }
        
        plainText += `\n`;
        
        // Try to fetch Bible verses for this note
        try {
          const verseReference = fullReference;
          const biblePassage = await BiblePassage.fetchPassage(verseReference);
          
          if (biblePassage && biblePassage.verses && biblePassage.verses.length > 0) {
            plainText += `SCRIPTURE TEXT:\n`;
            
            for (const verse of biblePassage.verses) {
              plainText += `[${verse.verse}] ${verse.text}\n\n`;
            }
          }
        } catch (error) {
          console.warn('Could not fetch Bible verses for plain text export:', error);
          plainText += `SCRIPTURE TEXT:\n`;
          plainText += `Bible verses could not be loaded for ${fullReference}\n\n`;
        }
        
        // Note content
        plainText += `STUDY NOTES:\n`;
        
        // Convert HTML content to plain text
        const formattedContent = formatContentForPlainText(note.content);
        plainText += `${formattedContent}\n\n`;
        
        if (i < sortedNotes.length - 1) {
          plainText += `${'='.repeat(50)}\n\n`;
        }
      }
      
      // Footer
      plainText += `${'='.repeat(50)}\n`;
      plainText += `Generated by VerseNotes v0.2.1\n`;
      plainText += `${notes.length} notes exported on ${timestamp}\n`;
      
      return plainText;
    } catch (error) {
      console.error('Error generating plain text export:', error);
      throw new Error('Failed to generate plain text export');
    }
  };

  // Format HTML content for Plain Text export
  const formatContentForPlainText = (html: string): string => {
    let plainText = html
      // Convert paragraph tags to double line breaks
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<p[^>]*>/gi, '')
      // Convert line breaks
      .replace(/<br\s*\/?>/gi, '\n')
      // Convert headings (add emphasis with caps and underlines)
      .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, (match, content) => `${content.toUpperCase()}\n${'='.repeat(content.length)}\n`)
      // Convert lists
      .replace(/<ul[^>]*>/gi, '')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<ol[^>]*>/gi, '')
      .replace(/<\/ol>/gi, '\n')
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<\/li>/gi, '\n')
      // Convert blockquotes
      .replace(/<blockquote[^>]*>/gi, '> ')
      .replace(/<\/blockquote>/gi, '\n')
      // Remove all other HTML tags
      .replace(/<[^>]*>/g, '')
      // Clean up extra whitespace
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple line breaks to double
      .replace(/\n\s+/g, '\n') // Remove spaces after line breaks
      .trim();

    return plainText;
  };

  // Unified export handler for all formats
  const handleExportNotes = async () => {
    setIsExporting(true);
    try {
      let content: string;
      let filename: string;
      let mimeType: string;
      const timestamp = new Date().toISOString().split('T')[0];

      switch (exportFormat) {
        case 'json':
          // Create comprehensive backup data
          const backupData = await createBackupData();
          content = JSON.stringify(backupData, null, 2);
          filename = `versenotes_backup_${timestamp}.json`;
          mimeType = 'application/json';
          break;
          
        case 'markdown':
          content = await generateMarkdownExport();
          filename = `versenotes_export_${timestamp}.md`;
          mimeType = 'text/markdown';
          break;
          
        case 'text':
          content = await generatePlainTextExport();
          filename = `versenotes_export_${timestamp}.txt`;
          mimeType = 'text/plain';
          break;
          
        default:
          throw new Error('Invalid export format');
      }

      if (Platform.OS === 'web') {
        // Web platform - use browser download
        exportNotesWeb(content, filename, mimeType);
        
        let successMessage = `${exportFormat.toUpperCase()} export completed successfully!\n\n`;
        if (exportFormat === 'json') {
          successMessage += `Includes:\n• ${notes.length} notes\n• User settings\n• Complete metadata`;
        } else {
          successMessage += `Includes:\n• ${notes.length} notes\n• Bible verses\n• Formatted for ${exportFormat === 'markdown' ? 'sharing' : 'reading'}`;
        }
        
        Alert.alert('Success', successMessage);
      } else {
        // Mobile platforms - use file system and sharing
        await exportNotesMobile(content, filename, mimeType);
      }
    } catch (error) {
      console.error('Error exporting notes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Error', `Failed to export notes: ${errorMessage}`);
    }
    setIsExporting(false);
  };

  // Updated mobile export function to handle different MIME types
  const exportNotesMobile = async (content: string, filename: string, mimeType: string = 'application/json') => {
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: mimeType,
        dialogTitle: 'Export Notes',
        UTI: mimeType === 'application/json' ? 'public.json' : 'public.plain-text',
      });
    } else {
      Alert.alert('Export Complete', `Notes exported to: ${fileUri}`);
    }
  };

  // Updated web export function to handle different MIME types
  const exportNotesWeb = (content: string, filename: string, mimeType: string = 'application/json') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleNavigateToBibleStudy = () => {
    if (navigation?.navigate) {
      navigation.navigate('BibleStudy');
    } else {
      Alert.alert('Info', 'Navigation not available in this context');
    }
  };

  const renderSettingRow = (
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
  ) => (
    <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
          {subtitle}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.disabled, true: theme.colors.accentBackground }}
        thumbColor={value ? theme.colors.accent : theme.colors.surface}
        style={styles.switch}
      />
    </View>
  );

  const renderActionRow = (
    title: string,
    subtitle: string,
    buttonTitle: string,
    onPress: () => void,
    loading?: boolean,
    variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'ghost',
  ) => (
    <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
          {subtitle}
        </Text>
      </View>
      <ButterButton
        title={buttonTitle}
        onPress={onPress}
        variant={variant || 'primary'}
        size="small"
        loading={loading}
        disabled={loading}
        style={styles.actionButton}
      />
    </View>
  );

  const renderThemeSelector = () => (
    <View style={styles.themeSelector}>
      <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Theme Preference</Text>
      <Text
        style={[styles.settingSubtitle, { color: theme.colors.textSecondary, marginBottom: 12 }]}
      >
        Currently: {scheme.preference.charAt(0).toUpperCase() + scheme.preference.slice(1)}
      </Text>
      <View style={styles.themeOptions}>
        <ButterButton
          title="Light"
          onPress={() => scheme.setColorSchemePreference('light')}
          variant={scheme.preference === 'light' ? 'primary' : 'secondary'}
          size="small"
          style={styles.themeButton}
        />
        <ButterButton
          title="Dark"
          onPress={() => scheme.setColorSchemePreference('dark')}
          variant={scheme.preference === 'dark' ? 'primary' : 'secondary'}
          size="small"
          style={styles.themeButton}
        />
        <ButterButton
          title="System"
          onPress={() => scheme.setColorSchemePreference('auto')}
          variant={scheme.preference === 'auto' ? 'primary' : 'secondary'}
          size="small"
          style={styles.themeButton}
        />
      </View>
    </View>
  );

  const renderExportFormatSelector = () => (
    <View style={styles.formatSelector}>
      <Text style={[styles.formatSelectorTitle, { color: theme.colors.text }]}>Export Format</Text>
      <View style={styles.formatOptions}>
        <TouchableOpacity
          style={[
            styles.formatOption,
            exportFormat === 'json' && styles.formatOptionSelected,
            { backgroundColor: exportFormat === 'json' ? theme.colors.accent : theme.colors.backgroundSecondary, borderColor: theme.colors.border }
          ]}
          onPress={() => setExportFormat('json')}
        >
          <Text style={[styles.formatOptionText, { color: exportFormat === 'json' ? theme.colors.textInverse : theme.colors.text }]}>
            JSON
          </Text>
          <Text style={[styles.formatOptionSubtext, { color: exportFormat === 'json' ? theme.colors.textInverse : theme.colors.textSecondary }]}>
            Backup & Import
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.formatOption,
            exportFormat === 'markdown' && styles.formatOptionSelected,
            { backgroundColor: exportFormat === 'markdown' ? theme.colors.accent : theme.colors.backgroundSecondary, borderColor: theme.colors.border }
          ]}
          onPress={() => setExportFormat('markdown')}
        >
          <Text style={[styles.formatOptionText, { color: exportFormat === 'markdown' ? theme.colors.textInverse : theme.colors.text }]}>
            Markdown
          </Text>
          <Text style={[styles.formatOptionSubtext, { color: exportFormat === 'markdown' ? theme.colors.textInverse : theme.colors.textSecondary }]}>
            Readable Format
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.formatOption,
            exportFormat === 'text' && styles.formatOptionSelected,
            { backgroundColor: exportFormat === 'text' ? theme.colors.accent : theme.colors.backgroundSecondary, borderColor: theme.colors.border }
          ]}
          onPress={() => setExportFormat('text')}
        >
          <Text style={[styles.formatOptionText, { color: exportFormat === 'text' ? theme.colors.textInverse : theme.colors.text }]}>
            Plain Text
          </Text>
          <Text style={[styles.formatOptionSubtext, { color: exportFormat === 'text' ? theme.colors.textInverse : theme.colors.textSecondary }]}>
            Simple Text
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      padding: 24,
      borderBottomWidth: 1,
      ...theme.elevation.low,
    },
    headerContent: {
      alignItems: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      marginBottom: 8,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      opacity: 0.8,
    },
    section: {
      marginTop: 24,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 16,
      letterSpacing: -0.3,
    },
    card: {
      borderRadius: 16,
      padding: 0,
      marginBottom: 16,
      borderWidth: 1,
      overflow: 'hidden',
      ...theme.elevation.low,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
    },
    settingInfo: {
      flex: 1,
      marginRight: 16,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
      letterSpacing: -0.2,
    },
    settingSubtitle: {
      fontSize: 14,
      lineHeight: 18,
    },
    switch: {
      transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
    },
    actionButton: {
      minWidth: 80,
    },
    themeSelector: {
      padding: 20,
    },
    themeOptions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    themeButton: {
      flex: 1,
    },
    footer: {
      padding: 20,
      marginTop: 24,
      marginBottom: 40,
    },
    saveButton: {
      marginBottom: 16,
    },
    backButton: {
      marginTop: 8,
    },
    statsCard: {
      padding: 20,
      alignItems: 'center',
    },
    statsTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
    },
    statsValue: {
      fontSize: 32,
      fontWeight: '700',
      marginBottom: 4,
    },
    statsLabel: {
      fontSize: 14,
      opacity: 0.8,
    },
    formatSelector: {
      padding: 20,
    },
    formatSelectorTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      letterSpacing: -0.2,
    },
    formatOptions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    formatOption: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    formatOptionSelected: {
      borderColor: theme.colors.accent,
    },
    formatOptionText: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    formatOptionSubtext: {
      fontSize: 12,
      opacity: 0.7,
    },
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border },
        ]}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Customize your Bible study experience
          </Text>
        </View>
      </View>

      {/* Study Statistics */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Study Statistics</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <View style={styles.statsCard}>
            <Text style={[styles.statsTitle, { color: theme.colors.text }]}>Total Notes</Text>
            <Text style={[styles.statsValue, { color: theme.colors.accent }]}>{notes.length}</Text>
            <Text style={[styles.statsLabel, { color: theme.colors.textSecondary }]}>
              {notes.length === 1 ? 'study note' : 'study notes'}
            </Text>
          </View>
        </View>
      </View>

      {/* Bible Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Bible Settings</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          {renderActionRow(
            'Default Translation',
            'Currently: WEB',
            'Change',
            () => Alert.alert('Info', 'Translation selection coming soon!'),
            false,
            'secondary',
          )}

          {renderActionRow(
            'Font Size',
            `Currently: ${settings.font_size}`,
            'Change',
            () => Alert.alert('Info', 'Font size selection coming soon!'),
            false,
            'secondary',
          )}

          {renderSettingRow(
            'Show Verse Numbers',
            'Display verse numbers in text',
            settings.verse_numbers,
            (value) => handleSettingChange('verse_numbers', value),
          )}

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                Paragraph Breaks
              </Text>
              <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                Show paragraph formatting
              </Text>
            </View>
            <Switch
              value={settings.paragraph_breaks}
              onValueChange={(value) => handleSettingChange('paragraph_breaks', value)}
              trackColor={{ false: theme.colors.disabled, true: theme.colors.accentBackground }}
              thumbColor={settings.paragraph_breaks ? theme.colors.accent : theme.colors.surface}
              style={styles.switch}
            />
          </View>
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>App Settings</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          {renderThemeSelector()}

          {renderSettingRow(
            'Auto-save Notes',
            'Automatically save changes',
            settings.auto_save,
            (value) => handleSettingChange('auto_save', value),
          )}

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Notifications</Text>
              <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                Daily reading reminders
              </Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => handleSettingChange('notifications', value)}
              trackColor={{ false: theme.colors.disabled, true: theme.colors.accentBackground }}
              thumbColor={settings.notifications ? theme.colors.accent : theme.colors.surface}
              style={styles.switch}
            />
          </View>
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Navigation</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Bible Study</Text>
              <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                Return to main study interface
              </Text>
            </View>
            <ButterButton
              title="Go"
              onPress={handleNavigateToBibleStudy}
              variant="accent"
              size="small"
              icon="📖"
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Data Management</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          {renderExportFormatSelector()}
          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Export Notes</Text>
              <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                Export all {notes.length} notes to {exportFormat.toUpperCase()}
              </Text>
            </View>
            <ButterButton
              title="Export"
              onPress={handleExportNotes}
              variant="secondary"
              size="small"
              loading={isExporting}
              disabled={isExporting}
              icon="📤"
              style={styles.actionButton}
            />
          </View>
          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Import Notes</Text>
              <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                Import notes from a JSON backup file
              </Text>
            </View>
            <ButterButton
              title="Import"
              onPress={handleImportNotes}
              variant="secondary"
              size="small"
              loading={isImporting}
              disabled={isImporting}
              icon="📥"
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.footer}>
        <ButterButton
          title="Save All Settings"
          onPress={handleSaveSettings}
          variant="success"
          size="large"
          loading={isSaving}
          disabled={isSaving}
          fullWidth
          style={styles.saveButton}
        />
        <ButterButton
          title="Back to Bible Study"
          onPress={handleNavigateToBibleStudy}
          variant="ghost"
          size="medium"
          fullWidth
          style={styles.backButton}
        />
      </View>
    </ScrollView>
  );
};

export default Settings;
