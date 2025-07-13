import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { User, UserSettings } from '../entities/User';
import { useThemeContext, useColorSchemeFromContext } from '../theme';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useNotes } from '../context/NotesProvider';
import ButterButton from '../components/common/ButterButton';

interface SettingsProps {
  navigation?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const Settings: React.FC<SettingsProps> = ({ navigation }) => {
  const { theme } = useThemeContext();
  const scheme = useColorSchemeFromContext(); // Use context-based colorScheme
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
            `Currently: ${settings.default_translation}`,
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
          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Export Notes</Text>
              <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                Export all {notes.length} notes to JSON
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
