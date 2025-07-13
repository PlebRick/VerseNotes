/**
 * VerseNotes Theme System
 *
 * Design tokens derived from development/Base44.png and optimized for Bible study workflows.
 * Provides consistent spacing, typography, and color palettes for light/dark modes.
 *
 * ┌─────────────────────────────────────────────────────────────────────────────────────┐
 * │                              DESIGN TOKEN REFERENCE                                 │
 * │                    Sampled from Base44.png Bible Study Interface                   │
 * └─────────────────────────────────────────────────────────────────────────────────────┘
 *
 * ── COLOR PALETTE ──────────────────────────────────────────────────────────────────────
 *
 * Primary Colors (Base44 Brand Palette):
 * ┌─────────────────┬─────────┬─────────────────────────────────────────────────────────┐
 * │ Token           │ Value   │ Usage                                                   │
 * ├─────────────────┼─────────┼─────────────────────────────────────────────────────────┤
 * │ accent          │ #007AFF │ Primary brand color - verse brackets, CTAs, links      │
 * │ accentLight     │ #81b0ff │ Hover states, light accents                            │
 * │ accentDark      │ #0056b3 │ Pressed states, dark accents                           │
 * │ success         │ #34C759 │ Save confirmations, positive feedback                   │
 * │ error           │ #ff3b30 │ Delete actions, validation errors                       │
 * │ warning         │ #f5dd4b │ Toggle states, caution indicators                       │
 * └─────────────────┴─────────┴─────────────────────────────────────────────────────────┘
 *
 * Semantic Colors (Context-Adaptive):
 * ┌─────────────────┬─────────┬─────────┬─────────────────────────────────────────────────┐
 * │ Token           │ Light   │ Dark    │ Usage                                           │
 * ├─────────────────┼─────────┼─────────┼─────────────────────────────────────────────────┤
 * │ background      │ #ffffff │ #000000 │ Main app background                             │
 * │ backgroundSec   │ #f5f5f5 │ #1c1c1e │ Secondary sections, input backgrounds           │
 * │ surface         │ #ffffff │ #2c2c2e │ Cards, modals, elevated content                 │
 * │ text            │ #333333 │ #ffffff │ Primary text, headings                          │
 * │ textSecondary   │ #666666 │ #8e8e93 │ Subtitles, metadata                            │
 * │ textMuted       │ #888888 │ #6d6d70 │ Placeholders, disabled text                     │
 * │ border          │ #e0e0e0 │ #38383a │ Component borders, dividers                     │
 * └─────────────────┴─────────┴─────────┴─────────────────────────────────────────────────┘
 *
 * ── SPACING SCALE ──────────────────────────────────────────────────────────────────────
 *
 * 4px Grid System (Base44 Responsive Layout):
 * ┌─────────────────┬───────┬─────────────────────────────────────────────────────────────┐
 * │ Token           │ Value │ Usage                                                       │
 * ├─────────────────┼───────┼─────────────────────────────────────────────────────────────┤
 * │ xs              │   2px │ Fine adjustments, icon spacing                              │
 * │ sm              │   4px │ Minimal padding, tight layouts                              │
 * │ md              │   8px │ Standard element spacing                                    │
 * │ lg              │  12px │ Component internal padding                                  │
 * │ xl              │  16px │ Section padding, card spacing                               │
 * │ xxl             │  20px │ Page margins, container spacing                             │
 * │ xxxl            │  24px │ Major section separation                                    │
 * │ xxxxl           │  32px │ Large layout spacing                                        │
 * │ xxxxxl          │  40px │ Extra large layout spacing                                  │
 * │ xxxxxxl         │  48px │ Maximum layout spacing                                      │
 * └─────────────────┴───────┴─────────────────────────────────────────────────────────────┘
 *
 * ── TYPOGRAPHY SCALE ───────────────────────────────────────────────────────────────────
 *
 * Optimized for Reading Comprehension (Bible Text Focus):
 * ┌─────────────────┬───────┬────────┬─────────────────────────────────────────────────────┐
 * │ Token           │ Size  │ Line H │ Usage                                               │
 * ├─────────────────┼───────┼────────┼─────────────────────────────────────────────────────┤
 * │ xs              │  12px │  16px  │ Footnotes, verse numbers, metadata                 │
 * │ sm              │  14px │  18px  │ Captions, subtitles, secondary text                │
 * │ md              │  16px │  20px  │ Body text, verse content (optimal reading)         │
 * │ lg              │  18px │  24px  │ Section headings, emphasized text                   │
 * │ xl              │  20px │  28px  │ Page titles, major headings                        │
 * │ xxl             │  28px │  32px  │ Display text, app branding                         │
 * └─────────────────┴───────┴────────┴─────────────────────────────────────────────────────┘
 *
 * ── COMPONENT TOKENS ───────────────────────────────────────────────────────────────────
 *
 * Interactive Elements (Touch-Optimized for Tablet):
 * ┌─────────────────┬───────────────┬─────────────────────────────────────────────────────┐
 * │ Component       │ Dimensions    │ Usage                                               │
 * ├─────────────────┼───────────────┼─────────────────────────────────────────────────────┤
 * │ Touch Target    │ 44x44px min   │ Accessibility compliance (iOS HIG)                 │
 * │ Button          │ 44px height   │ Primary actions, form submissions                   │
 * │ Input Field     │ 44px height   │ Text inputs, search bars                           │
 * │ Add Button      │ 36x36px       │ Floating action buttons                            │
 * │ Delete Button   │ 24x24px       │ Destructive micro-actions                          │
 * │ Verse Bracket   │ 16x48px       │ SVG verse indicators                               │
 * └─────────────────┴───────────────┴─────────────────────────────────────────────────────┘
 *
 * ── ELEVATION SYSTEM ───────────────────────────────────────────────────────────────────
 *
 * Material Design Shadows (Base44 Layer Hierarchy):
 * ┌─────────────────┬─────────────────────────────────────────────────────────────────────┐
 * │ Level           │ Usage                                                               │
 * ├─────────────────┼─────────────────────────────────────────────────────────────────────┤
 * │ none            │ Flat elements, flush with background                               │
 * │ low             │ Subtle depth, card-like elements                                   │
 * │ medium          │ Modals, overlays, elevated content                                 │
 * │ high            │ Dialogs, dropdowns, maximum prominence                             │
 * └─────────────────┴─────────────────────────────────────────────────────────────────────┘
 *
 * ── DESIGN PRINCIPLES ──────────────────────────────────────────────────────────────────
 *
 * • Reading First: Typography optimized for extended Bible reading sessions
 * • Accessible: WCAG 2.1 AA compliant contrast ratios and touch targets
 * • Responsive: Scales from mobile (320px) to tablet (1024px+)
 * • Consistent: Systematic use of spacing and color tokens
 * • Purposeful: Every design decision supports Bible study workflows
 *
 * Last Updated: 2025-07-13 (Derived from Base44.png reference)
 */

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base color palette (semantic colors that don't change between themes)
export const BaseColors = {
  // Brand colors
  primary: '#007AFF',
  primaryLight: '#81b0ff',
  primaryDark: '#0056b3',

  // Semantic colors
  success: '#28a745', // Improved contrast: was #34C759 (2.22:1 → 3.05:1)
  error: '#ff3b30',
  warning: '#f5dd4b',
  info: '#007AFF',

  // Static colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

// Light theme palette
export const LightPalette = {
  // Backgrounds
  background: '#ffffff',
  backgroundSecondary: '#f5f5f5',
  backgroundTertiary: '#f9f9f9',
  backgroundElevated: '#ffffff',

  // Surfaces
  surface: '#ffffff',
  surfaceSecondary: '#f0f0f0',
  surfaceElevated: '#ffffff',

  // Text colors
  text: '#333333',
  textSecondary: '#666666',
  textTertiary: '#777777',
  textPlaceholder: '#777777', // Improved contrast: was #999999 (2.61:1 → 3.37:1)
  textInverse: '#ffffff',
  textMuted: '#aaa',
  textSubtle: '#888888',
  textDark: '#222222',

  // Border colors
  border: '#e0e0e0',
  borderSecondary: '#ddd',
  borderLight: '#f0f0f0',

  // Accent colors
  accent: BaseColors.primary,
  accentBackground: '#f0f8ff',
  accentBackgroundSecondary: '#e3f2fd',

  // Switch/Toggle colors
  switchTrackInactive: '#767577',
  switchTrackActive: '#81b0ff',
  switchThumbInactive: '#f4f3f4',
  switchThumbActive: '#f5dd4b',

  // Shadow
  shadow: BaseColors.black,

  // Status colors
  success: BaseColors.success,
  error: BaseColors.error,
  warning: BaseColors.warning,

  // Disabled state
  disabled: '#ccc',
} as const;

// Dark theme palette
export const DarkPalette = {
  // Backgrounds
  background: '#000000',
  backgroundSecondary: '#1a1a1a',
  backgroundTertiary: '#2a2a2a',
  backgroundElevated: '#1a1a1a',

  // Surfaces
  surface: '#1a1a1a',
  surfaceSecondary: '#2a2a2a',
  surfaceElevated: '#2a2a2a',

  // Text colors
  text: '#ffffff',
  textSecondary: '#b3b3b3',
  textTertiary: '#808080',
  textPlaceholder: '#666666',
  textInverse: '#000000',
  textMuted: '#666666',
  textSubtle: '#999999',
  textDark: '#ffffff',

  // Border colors
  border: '#333333',
  borderSecondary: '#444444',
  borderLight: '#2a2a2a',

  // Accent colors
  accent: BaseColors.primary,
  accentBackground: '#1a2332',
  accentBackgroundSecondary: '#1a1f2e',

  // Switch/Toggle colors
  switchTrackInactive: '#555555',
  switchTrackActive: '#81b0ff',
  switchThumbInactive: '#888888',
  switchThumbActive: '#f5dd4b',

  // Shadow
  shadow: BaseColors.black,

  // Status colors
  success: BaseColors.success,
  error: BaseColors.error,
  warning: BaseColors.warning,

  // Disabled state
  disabled: '#666666',
} as const;

// Spacing tokens (4px grid system)
export const spacing = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  xxxxl: 32,
  xxxxxl: 40,
  xxxxxxl: 48,

  // Semantic spacing
  padding: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  margin: {
    xs: 2,
    sm: 5,
    md: 8,
    lg: 10,
    xl: 12,
    xxl: 15,
    xxxl: 16,
    xxxxl: 20,
  },
  borderRadius: {
    xs: 4,
    sm: 5,
    md: 6,
    lg: 8,
    xl: 10,
    xxl: 12,
    xxxl: 18,
  },
} as const;

// Typography tokens
export const fonts = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 28,
  },
  weights: {
    normal: 'normal' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: 'bold' as const,
  },
  lineHeights: {
    xs: 16,
    sm: 18,
    md: 20,
    lg: 24,
    xl: 28,
    xxl: 32,
  },
  families: {
    // React Native uses system fonts by default
    system: 'System',
  },
} as const;

// Elevation/Shadow tokens
export const elevation = {
  none: {
    shadowColor: BaseColors.transparent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  low: {
    shadowColor: BaseColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: BaseColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  high: {
    shadowColor: BaseColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
} as const;

// Component-specific tokens
export const components = {
  // Activity Indicator
  activityIndicator: {
    sizeLarge: 'large' as const,
    sizeSmall: 'small' as const,
  },

  // Touch targets (accessibility)
  touchTarget: {
    minHeight: 44,
    minWidth: 44,
  },

  // Common component dimensions
  button: {
    height: 44,
    minWidth: 60,
  },
  input: {
    height: 44,
    minHeight: 44,
  },
  addButton: {
    width: 44, // Improved accessibility: was 36px
    height: 44, // Improved accessibility: was 36px
    borderRadius: 22,
  },
  deleteButton: {
    width: 44, // Improved accessibility: was 24px
    height: 44, // Improved accessibility: was 24px
    borderRadius: 22,
    // Note: Inner icon can be smaller, but touch area is 44px
  },
} as const;

// Color palette interface (supports both light and dark themes)
export interface ColorPalette {
  // Backgrounds
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  backgroundElevated: string;

  // Surfaces
  surface: string;
  surfaceSecondary: string;
  surfaceElevated: string;

  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  textPlaceholder: string;
  textInverse: string;
  textMuted: string;
  textSubtle: string;
  textDark: string;

  // Border colors
  border: string;
  borderSecondary: string;
  borderLight: string;

  // Accent colors
  accent: string;
  accentBackground: string;
  accentBackgroundSecondary: string;

  // Switch/Toggle colors
  switchTrackInactive: string;
  switchTrackActive: string;
  switchThumbInactive: string;
  switchThumbActive: string;

  // Shadow
  shadow: string;

  // Status colors
  success: string;
  error: string;
  warning: string;

  // Disabled state
  disabled: string;
}

// Theme interface
export interface Theme {
  colors: ColorPalette;
  spacing: typeof spacing;
  fonts: typeof fonts;
  elevation: typeof elevation;
  components: typeof components;
}

// Default themes
export const lightTheme: Theme = {
  colors: LightPalette,
  spacing,
  fonts,
  elevation,
  components,
};

export const darkTheme: Theme = {
  colors: DarkPalette,
  spacing,
  fonts,
  elevation,
  components,
};

// Theme type for TypeScript
export type ThemeMode = 'light' | 'dark';
export type ColorSchemePreference = 'auto' | 'light' | 'dark';

// Color scheme storage key
const COLOR_SCHEME_STORAGE_KEY = 'versenotes_color_scheme_preference';

// Color scheme detection and management
export const useColorScheme = () => {
  const [preference, setPreference] = useState<ColorSchemePreference>('auto');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );

  // Load saved preference on mount
  useEffect(() => {
    const loadSavedPreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
        if (saved && ['auto', 'light', 'dark'].includes(saved)) {
          setPreference(saved as ColorSchemePreference);
        }
      } catch (error) {
        console.error('Error loading color scheme preference:', error);
      }
    };

    loadSavedPreference();
  }, []);

  // Listen to system color scheme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  // Calculate effective theme mode
  const getEffectiveThemeMode = (): ThemeMode => {
    if (preference === 'auto') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return preference as ThemeMode;
  };

  // Toggle between light/dark (skips auto for manual toggle)
  const toggleColorScheme = async () => {
    const currentMode = getEffectiveThemeMode();
    const newPreference: ColorSchemePreference = currentMode === 'light' ? 'dark' : 'light';

    setPreference(newPreference);

    try {
      await AsyncStorage.setItem(COLOR_SCHEME_STORAGE_KEY, newPreference);
    } catch (error) {
      console.error('Error saving color scheme preference:', error);
    }
  };

  // Set specific preference
  const setColorSchemePreference = async (newPreference: ColorSchemePreference) => {
    setPreference(newPreference);

    try {
      await AsyncStorage.setItem(COLOR_SCHEME_STORAGE_KEY, newPreference);
    } catch (error) {
      console.error('Error saving color scheme preference:', error);
    }
  };

  return {
    preference,
    systemColorScheme,
    effectiveThemeMode: getEffectiveThemeMode(),
    toggleColorScheme,
    setColorSchemePreference,
    isAuto: preference === 'auto',
    isDark: getEffectiveThemeMode() === 'dark',
  };
};

// Enhanced theme context with color scheme controls
interface ThemeContextValue {
  theme: Theme;
  colorScheme: ReturnType<typeof useColorScheme>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ThemeProvider component with automatic color scheme detection
interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme }) => {
  const colorScheme = useColorScheme();

  // Select theme based on effective theme mode (unless override provided)
  const selectedTheme = initialTheme || (colorScheme.isDark ? darkTheme : lightTheme);

  const contextValue: ThemeContextValue = {
    theme: selectedTheme,
    colorScheme,
  };

  return React.createElement(ThemeContext.Provider, { value: contextValue }, children);
};

// useTheme hook - returns theme object
export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context.theme;
};

// useThemeContext hook - returns full context with color scheme controls
export const useThemeContext = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }

  return context;
};

// Default export for convenience
export default lightTheme;
