import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { useThemeContext } from '../../theme';
import ButterButton from '../common/ButterButton';

interface BibleSearchBarProps {
  onSearch: (reference: string) => void;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const BibleSearchBar: React.FC<BibleSearchBarProps> = ({
  onSearch,
  placeholder = 'Enter reference (e.g., John 3 or Romans 1:1-16)',
  value,
  onChangeText,
}) => {
  const { theme } = useThemeContext();
  const [searchText, setSearchText] = useState(value || '');

  // Update internal state when value prop changes (for persistence)
  useEffect(() => {
    if (value !== undefined) {
      setSearchText(value);
    }
  }, [value]);

  const handleTextChange = (text: string) => {
    setSearchText(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };

  const handleSearch = () => {
    if (!searchText.trim()) {
      Alert.alert('Error', 'Please enter a Bible reference');
      return;
    }
    // Accept any non-empty string for bible-api.com
    onSearch(searchText.trim());
  };

  const handleSubmitEditing = () => {
    handleSearch();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.backgroundSecondary }]}>
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          value={searchText}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textPlaceholder}
          onSubmitEditing={handleSubmitEditing}
          returnKeyType="search"
          autoCapitalize="words"
          autoCorrect={false}
        />
        <ButterButton
          title="Go"
          onPress={handleSearch}
          variant="primary"
          size="medium"
          icon="🔍"
          style={styles.searchButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Container styles handled by parent
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    paddingVertical: 0,
    marginRight: 12,
  },
  searchButton: {
    minWidth: 80,
  },
});

export default BibleSearchBar;
