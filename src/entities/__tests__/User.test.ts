import { User } from '../User';

describe('User', () => {
  describe('loadSettings', () => {
    it('should load default settings when none exist', async () => {
      const settings = await User.loadSettings();
      expect(settings).toHaveProperty('font_size');
      expect(settings).toHaveProperty('theme');
      expect(settings).toHaveProperty('auto_save');
    });
  });

  describe('saveSettings', () => {
    it('should save settings successfully', async () => {
      const testSettings = {
        font_size: 'large',
        theme: 'dark',
        auto_save: true,
        verse_numbers: true,
        paragraph_breaks: false,
        notifications: true,
      };

      await User.saveSettings(testSettings);
      const savedSettings = await User.loadSettings();
      expect(savedSettings.font_size).toBe('large');
      expect(savedSettings.theme).toBe('dark');
    });
  });
});