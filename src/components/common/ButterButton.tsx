import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useThemeContext } from '../../theme';

const { width: screenWidth } = Dimensions.get('window');

export interface ButterButtonProps {
  title: string;
  onPress: () => void;
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'error'
    | 'ghost'
    | 'darkGray'
    | 'white'
    | 'lightGray';
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
  const isTablet = screenWidth > 768;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      ...theme.elevation.low,
    };

    // Responsive size variations
    switch (size) {
      case 'small':
        baseStyle.paddingHorizontal = isTablet ? 16 : 12;
        baseStyle.paddingVertical = isTablet ? 10 : 8;
        baseStyle.minHeight = isTablet ? 36 : 32;
        break;
      case 'large':
        baseStyle.paddingHorizontal = isTablet ? 32 : 24;
        baseStyle.paddingVertical = isTablet ? 20 : 16;
        baseStyle.minHeight = isTablet ? 56 : 52;
        break;
      default: // medium
        baseStyle.paddingHorizontal = isTablet ? 20 : 16;
        baseStyle.paddingVertical = isTablet ? 14 : 12;
        baseStyle.minHeight = isTablet ? 48 : 44;
        break;
    }

    // Full width
    if (fullWidth) {
      baseStyle.width = '100%';
    }

    // Web-specific enhancements would go here
    // Note: Web-specific CSS properties are not supported in React Native ViewStyle

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
        case 'darkGray':
          baseStyle.backgroundColor = theme.colors.buttonDarkGray;
          break;
        case 'white':
          baseStyle.backgroundColor = theme.colors.buttonWhite;
          baseStyle.borderWidth = 1;
          baseStyle.borderColor = theme.colors.border;
          break;
        case 'lightGray':
          baseStyle.backgroundColor = theme.colors.backgroundSecondary;
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
      textAlign: 'center',
    };

    // Responsive text size variations
    switch (size) {
      case 'small':
        baseTextStyle.fontSize = isTablet ? 15 : 14;
        break;
      case 'large':
        baseTextStyle.fontSize = isTablet ? 19 : 18;
        break;
      default: // medium
        baseTextStyle.fontSize = isTablet ? 17 : 16;
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
        case 'darkGray':
          baseTextStyle.color = theme.colors.textInverse;
          break;
        case 'white':
          baseTextStyle.color = theme.colors.text;
          break;
        case 'lightGray':
          baseTextStyle.color = theme.colors.text;
          break;
      }
    }

    return baseTextStyle;
  };

  const getIconStyle = (): TextStyle => {
    const iconStyle: TextStyle = {
      marginRight: 8,
    };

    // Responsive icon size
    switch (size) {
      case 'small':
        iconStyle.fontSize = isTablet ? 16 : 14;
        break;
      case 'large':
        iconStyle.fontSize = isTablet ? 20 : 18;
        break;
      default: // medium
        iconStyle.fontSize = isTablet ? 18 : 16;
        break;
    }

    return iconStyle;
  };

  // Web-specific event handlers
  const handlePress = () => {
    if (disabled || loading) return;
    onPress();
  };

  // Web keyboard handling would be implemented here if needed
  // const handleKeyPress = (event: KeyboardEvent) => { ... }

  // Web-specific props would need to be handled differently for React Native Web
  const webProps = {};

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
      {...webProps}
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
          {icon && <Text style={[getTextStyle(), getIconStyle()]}>{icon}</Text>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default ButterButton;
