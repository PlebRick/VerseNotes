import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { User, UserSettings } from '../entities/User';
import { useThemeContext, useColorScheme } from '../theme';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useNotes } from '../context/NotesProvider';

interface SettingsProps {
  navigation?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const Settings: React.FC<SettingsProps> = ({ navigation }) => {
  const { theme } = useThemeContext();
  const scheme = useColorScheme(); // Use for toggle
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [_unusedUserVar, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [settings, setSettings] = useState<UserSettings>({
    default_translation: 'ESV',
    font_size: 'medium',
    theme: 'light',
    auto_save: true,
    verse_numbers: true,
    paragraph_breaks: true,
    notifications: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { notes } = useNotes(); // Get all notes from context

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

  const handleExportNotes = async () => {
    setIsExporting(true);
    try {
      // Create JSON content
      const jsonContent = JSON.stringify(notes, null, 2);

      // Define file path
      const fileUri = `${FileSystem.documentDirectory}versenotes_export_${new Date().toISOString()}.json`;

      // Write file
      await FileSystem.writeAsStringAsync(fileUri, jsonContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Share the file
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Export Notes',
        UTI: 'public.json',
      });
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
    onValueChange: (value: boolean) => void,
  ) => (
    <View style={[styles.settingRow, { borderBottomColor: theme.colors.borderSecondary }]}>
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
        thumbColor={value ? theme.colors.warning : theme.colors.backgroundTertiary}
      />
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      padding: 20,
      borderBottomWidth: 1,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 16,
    },
    section: {
      marginTop: 20,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 10,
    },
    card: {
      borderRadius: 10,
      padding: 15,
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
    },
    settingInfo: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: 14,
    },
    button: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 5,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '500',
    },
    buttonDisabled: {
      // backgroundColor handled by theme in JSX
    },
    footer: {
      padding: 20,
      marginTop: 20,
    },
    saveButton: {
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    themePicker: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
    themeButton: {
      padding: 10,
      borderRadius: 5,
    },
    themeButtonSelected: {
      backgroundColor: theme.colors.accentBackground,
    },
    themeButtonText: {
      fontSize: 14,
    },
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.backgroundSecondary }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border },
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Customize your Bible study experience
        </Text>
      </View>

      {/* Bible Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Bible Settings</Text>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow },
          ]}
        >
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.borderSecondary }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                Default Translation
              </Text>
              <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                Currently: {settings.default_translation}
              </Text>
            </View>
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.accent }]}>
              <Text style={[styles.buttonText, { color: theme.colors.textInverse }]}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.settingRow, { borderBottomColor: theme.colors.borderSecondary }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Font Size</Text>
              <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                Currently: {settings.font_size}
              </Text>
            </View>
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.accent }]}>
              <Text style={[styles.buttonText, { color: theme.colors.textInverse }]}>Change</Text>
            </TouchableOpacity>
          </View>

          {renderSettingRow(
            'Show Verse Numbers',
            'Display verse numbers in text',
            settings.verse_numbers,
            (value) => handleSettingChange('verse_numbers', value),
          )}

          {renderSettingRow(
            'Paragraph Breaks',
            'Show paragraph formatting',
            settings.paragraph_breaks,
            (value) => handleSettingChange('paragraph_breaks', value),
          )}
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>App Settings</Text>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow },
          ]}
        >
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.borderSecondary }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                Theme Preference
              </Text>
              <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                Currently: {scheme.preference.charAt(0).toUpperCase() + scheme.preference.slice(1)}
              </Text>
            </View>
          </View>
          <View style={styles.themePicker}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                scheme.preference === 'light' && styles.themeButtonSelected,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={() => scheme.setColorSchemePreference('light')}
            >
              <Text style={[styles.themeButtonText, { color: theme.colors.text }]}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                scheme.preference === 'dark' && styles.themeButtonSelected,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={() => scheme.setColorSchemePreference('dark')}
            >
              <Text style={[styles.themeButtonText, { color: theme.colors.text }]}>Dark</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                scheme.preference === 'auto' && styles.themeButtonSelected,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={() => scheme.setColorSchemePreference('auto')}
            >
              <Text style={[styles.themeButtonText, { color: theme.colors.text }]}>System</Text>
            </TouchableOpacity>
          </View>

          {renderSettingRow(
            'Auto-save Notes',
            'Automatically save changes',
            settings.auto_save,
            (value) => handleSettingChange('auto_save', value),
          )}

          {renderSettingRow(
            'Notifications',
            'Daily reading reminders',
            settings.notifications,
            (value) => handleSettingChange('notifications', value),
          )}
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Navigation</Text>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow },
          ]}
        >
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.borderSecondary }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Bible Study</Text>
              <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                Go to main Bible study interface
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.accent }]}
              onPress={() => {
                if (navigation?.navigate) {
                  navigation.navigate('BibleStudy');
                } else {
                  Alert.alert('Info', 'Navigation not available in this context');
                }
              }}
            >
              <Text style={[styles.buttonText, { color: theme.colors.textInverse }]}>Go</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Data Management</Text>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow },
          ]}
        >
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.borderSecondary }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Export Notes</Text>
              <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                Export all notes to markdown
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.colors.accent },
                isExporting && [styles.buttonDisabled, { backgroundColor: theme.colors.disabled }],
              ]}
              onPress={handleExportNotes}
              disabled={isExporting}
            >
              {isExporting ? (
                <ActivityIndicator size="small" color={theme.colors.textInverse} />
              ) : (
                <Text style={[styles.buttonText, { color: theme.colors.textInverse }]}>Export</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: theme.colors.success },
            isSaving && [styles.buttonDisabled, { backgroundColor: theme.colors.disabled }],
          ]}
          onPress={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={theme.colors.textInverse} />
          ) : (
            <Text style={[styles.saveButtonText, { color: theme.colors.textInverse }]}>
              Save All Settings
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Settings;
