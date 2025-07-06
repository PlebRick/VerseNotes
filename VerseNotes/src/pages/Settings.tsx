import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { User, UserSettings } from '../entities/User';
import { BibleNote } from '../entities/BibleNote';

interface SettingsProps {
  navigation?: any;
}

const Settings: React.FC<SettingsProps> = ({ navigation }) => {
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<UserSettings>({
    default_translation: 'ESV',
    font_size: 'medium',
    theme: 'light',
    auto_save: true,
    verse_numbers: true,
    paragraph_breaks: true,
    notifications: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleExportNotes = async () => {
    setIsExporting(true);
    try {
      const allNotes = await BibleNote.list('-created_date', 1000);
      
      let markdownContent = `# Bible Study Notes\n\nExported on: ${new Date().toLocaleDateString()}\n\n---\n\n`;

      allNotes.forEach(note => {
        markdownContent += `## ${note.title}\n\n`;
        markdownContent += `**Reference:** ${note.verse_reference}\n\n`;
        markdownContent += `**Tags:** ${note.tags ? note.tags.join(', ') : 'None'}\n\n`;
        markdownContent += `${note.content}\n\n---\n\n`;
      });

      // In a real app, you would use a file system library to save the file
      Alert.alert('Export Complete', `Exported ${allNotes.length} notes to markdown format.`);
    } catch (error) {
      console.error('Error exporting notes:', error);
      Alert.alert('Error', 'Failed to export notes. Please try again.');
    }
    setIsExporting(false);
  };

  const renderSettingRow = (
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your Bible study experience</Text>
      </View>

      {/* Bible Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bible Settings</Text>
        
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Default Translation</Text>
              <Text style={styles.settingSubtitle}>Currently: {settings.default_translation}</Text>
            </View>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Font Size</Text>
              <Text style={styles.settingSubtitle}>Currently: {settings.font_size}</Text>
            </View>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Change</Text>
            </TouchableOpacity>
          </View>

          {renderSettingRow(
            'Show Verse Numbers',
            'Display verse numbers in text',
            settings.verse_numbers,
            (value) => handleSettingChange('verse_numbers', value)
          )}

          {renderSettingRow(
            'Paragraph Breaks',
            'Show paragraph formatting',
            settings.paragraph_breaks,
            (value) => handleSettingChange('paragraph_breaks', value)
          )}
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Theme</Text>
              <Text style={styles.settingSubtitle}>Currently: {settings.theme}</Text>
            </View>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Change</Text>
            </TouchableOpacity>
          </View>

          {renderSettingRow(
            'Auto-save Notes',
            'Automatically save changes',
            settings.auto_save,
            (value) => handleSettingChange('auto_save', value)
          )}

          {renderSettingRow(
            'Notifications',
            'Daily reading reminders',
            settings.notifications,
            (value) => handleSettingChange('notifications', value)
          )}
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Navigation</Text>
        
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Bible Study</Text>
              <Text style={styles.settingSubtitle}>Go to main Bible study interface</Text>
            </View>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => {
                if (navigation?.navigate) {
                  navigation.navigate('BibleStudy');
                } else {
                  Alert.alert('Info', 'Navigation not available in this context');
                }
              }}
            >
              <Text style={styles.buttonText}>Go</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Export Notes</Text>
              <Text style={styles.settingSubtitle}>Export all notes to markdown</Text>
            </View>
            <TouchableOpacity 
              style={[styles.button, isExporting && styles.buttonDisabled]}
              onPress={handleExportNotes}
              disabled={isExporting}
            >
              {isExporting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Export</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveButton, isSaving && styles.buttonDisabled]}
          onPress={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save All Settings</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  footer: {
    padding: 20,
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Settings;