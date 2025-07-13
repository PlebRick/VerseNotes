import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useThemeContext } from '../../theme';

export interface ButterButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  icon?: string;
}

const ButterButton: React.FC<ButterButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  icon,
}) => {
  const { theme } = useThemeContext();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      ...theme.elevation.low,
    };

    // Size variations
    switch (size) {
      case 'small':
        baseStyle.paddingHorizontal = 12;
        baseStyle.paddingVertical = 8;
        baseStyle.minHeight = 32;
        break;
      case 'large':
        baseStyle.paddingHorizontal = 24;
        baseStyle.paddingVertical = 16;
        baseStyle.minHeight = 52;
        break;
      default: // medium
        baseStyle.paddingHorizontal = 16;
        baseStyle.paddingVertical = 12;
        baseStyle.minHeight = 44;
        break;
    }

    // Full width
    if (fullWidth) {
      baseStyle.width = '100%';
    }

    // Variant colors
    if (disabled || loading) {
      baseStyle.backgroundColor = theme.colors.disabled;
      baseStyle.opacity = 0.6;
    } else {
      switch (variant) {
        case 'primary':
          baseStyle.backgroundColor = theme.colors.accent;
          break;
        case 'secondary':
          baseStyle.backgroundColor = theme.colors.surface;
          baseStyle.borderWidth = 1;
          baseStyle.borderColor = theme.colors.border;
          break;
        case 'accent':
          baseStyle.backgroundColor = theme.colors.accentBackground;
          break;
        case 'success':
          baseStyle.backgroundColor = theme.colors.success;
          break;
        case 'error':
          baseStyle.backgroundColor = theme.colors.error;
          break;
        case 'ghost':
          baseStyle.backgroundColor = 'transparent';
          baseStyle.borderWidth = 1;
          baseStyle.borderColor = theme.colors.border;
          break;
      }
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      letterSpacing: -0.2,
    };

    // Size variations
    switch (size) {
      case 'small':
        baseTextStyle.fontSize = 14;
        break;
      case 'large':
        baseTextStyle.fontSize = 18;
        break;
      default: // medium
        baseTextStyle.fontSize = 16;
        break;
    }

    // Text color based on variant
    if (disabled || loading) {
      baseTextStyle.color = theme.colors.textMuted;
    } else {
      switch (variant) {
        case 'primary':
        case 'success':
        case 'error':
          baseTextStyle.color = theme.colors.textInverse;
          break;
        case 'secondary':
        case 'ghost':
          baseTextStyle.color = theme.colors.text;
          break;
        case 'accent':
          baseTextStyle.color = theme.colors.accent;
          break;
      }
    }

    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'primary' || variant === 'success' || variant === 'error'
              ? theme.colors.textInverse
              : theme.colors.accent
          }
        />
      ) : (
        <>
          {icon && <Text style={[getTextStyle(), { marginRight: 8 }]}>{icon}</Text>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default ButterButton;
