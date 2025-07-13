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
 * • Responsive: Fluid spacing and typography across mobile and tablet
 * • Consistent: Unified design language across all components
 * • Performant: Minimal re-renders with memoized theme contexts
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Enhanced Base color palette with Base44 harmonization
export const BaseColors = {
  // Brand colors (Base44 inspired)
  primary: '#007AFF',
  primaryLight: '#4DA3FF',
  primaryDark: '#0056CC',

  // Enhanced semantic colors with better contrast
  success: '#34C759',
  successLight: '#66D478',
  successDark: '#28A745',

  error: '#FF3B30',
  errorLight: '#FF6B5A',
  errorDark: '#CC2E24',

  warning: '#FF9500',
  warningLight: '#FFB366',
  warningDark: '#CC7700',

  info: '#5AC8FA',
  infoLight: '#7DD3FC',
  infoDark: '#48A0C8',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  transparent: 'transparent',
} as const;

// Enhanced Light theme palette with Base44 harmonization
export const LightPalette = {
  // Backgrounds - cleaner, more modern
  background: BaseColors.white,
  backgroundSecondary: BaseColors.gray50,
  backgroundTertiary: BaseColors.gray100,
  backgroundElevated: BaseColors.white,

  // Surfaces - better hierarchy
  surface: BaseColors.white,
  surfaceSecondary: BaseColors.gray50,
  surfaceElevated: BaseColors.white,

  // Text colors - improved contrast and readability
  text: BaseColors.gray900,
  textSecondary: BaseColors.gray600,
  textTertiary: BaseColors.gray500,
  textPlaceholder: BaseColors.gray400,
  textInverse: BaseColors.white,
  textMuted: BaseColors.gray400,
  textSubtle: BaseColors.gray500,
  textDark: BaseColors.gray900,

  // Border colors - subtle and modern
  border: BaseColors.gray200,
  borderSecondary: BaseColors.gray300,
  borderLight: BaseColors.gray100,

  // Accent colors - Base44 inspired
  accent: BaseColors.primary,
  accentBackground: '#F0F8FF',
  accentBackgroundSecondary: '#E3F2FD',

  // Switch/Toggle colors
  switchTrackInactive: BaseColors.gray300,
  switchTrackActive: BaseColors.primaryLight,
  switchThumbInactive: BaseColors.white,
  switchThumbActive: BaseColors.white,

  // Shadow
  shadow: BaseColors.black,

  // Status colors
  success: BaseColors.success,
  error: BaseColors.error,
  warning: BaseColors.warning,

  // Disabled state
  disabled: BaseColors.gray300,
} as const;

// Enhanced Dark theme palette with Base44 harmonization
export const DarkPalette = {
  // Backgrounds - true dark with subtle variations
  background: BaseColors.black,
  backgroundSecondary: '#1C1C1E',
  backgroundTertiary: '#2C2C2E',
  backgroundElevated: '#1C1C1E',

  // Surfaces - elevated dark surfaces
  surface: '#1C1C1E',
  surfaceSecondary: '#2C2C2E',
  surfaceElevated: '#3A3A3C',

  // Text colors - optimized for dark backgrounds
  text: BaseColors.white,
  textSecondary: '#8E8E93',
  textTertiary: '#6D6D70',
  textPlaceholder: '#6D6D70',
  textInverse: BaseColors.black,
  textMuted: '#6D6D70',
  textSubtle: '#8E8E93',
  textDark: BaseColors.white,

  // Border colors - subtle in dark mode
  border: '#38383A',
  borderSecondary: '#48484A',
  borderLight: '#2C2C2E',

  // Accent colors - maintained for consistency
  accent: BaseColors.primary,
  accentBackground: '#1A2332',
  accentBackgroundSecondary: '#1A1F2E',

  // Switch/Toggle colors
  switchTrackInactive: '#48484A',
  switchTrackActive: BaseColors.primaryLight,
  switchThumbInactive: '#8E8E93',
  switchThumbActive: BaseColors.white,

  // Shadow
  shadow: BaseColors.black,

  // Status colors
  success: BaseColors.success,
  error: BaseColors.error,
  warning: BaseColors.warning,

  // Disabled state
  disabled: '#48484A',
} as const;

// Enhanced spacing tokens (4px grid system)
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
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    xxxl: 24,
    xxxxl: 32,
  },
  borderRadius: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    xxxl: 24,
  },
} as const;

// Enhanced typography tokens with Base44 optimization
export const fonts = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    xxxxl: 32,
  },
  weights: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
  lineHeights: {
    xs: 16,
    sm: 18,
    md: 20,
    lg: 24,
    xl: 28,
    xxl: 32,
    xxxl: 36,
    xxxxl: 40,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
  families: {
    // React Native uses system fonts by default
    system: 'System',
    monospace: 'Menlo',
  },
} as const;

// Enhanced elevation/shadow tokens
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
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: BaseColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  high: {
    shadowColor: BaseColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  highest: {
    shadowColor: BaseColors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

// Enhanced component-specific tokens
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
    borderRadius: 12,
  },
  input: {
    height: 44,
    minHeight: 44,
    borderRadius: 12,
  },
  card: {
    borderRadius: 16,
    padding: 20,
  },
  modal: {
    borderRadius: 20,
    padding: 24,
  },

  // Specific component tokens
  searchBar: {
    height: 44,
    borderRadius: 12,
    padding: 16,
  },
  noteCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
} as const;

// Color palette interface
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

  // Create context value with proper dependency tracking
  const contextValue: ThemeContextValue = React.useMemo(
    () => ({
      theme: selectedTheme,
      colorScheme,
    }),
    [selectedTheme, colorScheme],
  );

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

// useColorScheme hook should be used via context to ensure state is shared
export const useColorSchemeFromContext = (): ReturnType<typeof useColorScheme> => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useColorSchemeFromContext must be used within a ThemeProvider');
  }

  return context.colorScheme;
};

// Default export for convenience
export default lightTheme;
