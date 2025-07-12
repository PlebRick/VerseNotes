import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserSettings {
  default_translation: string;
  font_size: string;
  theme: string;
  auto_save: boolean;
  verse_numbers: boolean;
  paragraph_breaks: boolean;
  notifications: boolean;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  settings: UserSettings;
  created_date: string;
  updated_date: string;
}

export class User {
  static async me(): Promise<UserData> {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        return JSON.parse(userData);
      }

      // Return default user data if none exists
      const defaultUser: UserData = {
        id: 'default_user',
        name: 'User',
        email: '',
        settings: {
          default_translation: 'ESV',
          font_size: 'medium',
          theme: 'light',
          auto_save: true,
          verse_numbers: true,
          paragraph_breaks: true,
          notifications: true,
        },
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      };

      await AsyncStorage.setItem('user_data', JSON.stringify(defaultUser));
      return defaultUser;
    } catch (error) {
      console.error('Error loading user data:', error);
      throw error;
    }
  }

  static async updateMyUserData(updates: Partial<UserData>): Promise<void> {
    try {
      const currentUser = await this.me();
      const updatedUser = {
        ...currentUser,
        ...updates,
        updated_date: new Date().toISOString(),
      };

      await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  }

  static async loadSettings(): Promise<UserSettings> {
    try {
      const user = await this.me();
      return user.settings;
    } catch (error) {
      console.error('Error loading settings:', error);
      throw error;
    }
  }

  static async saveSettings(settings: UserSettings): Promise<void> {
    try {
      const currentUser = await this.me();
      const updatedUser = {
        ...currentUser,
        settings,
        updated_date: new Date().toISOString(),
      };

      await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }
}
