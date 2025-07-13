import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { useThemeContext } from '../../theme';

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
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border },
      ]}
    >
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
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: theme.colors.accent }]}
          onPress={handleSearch}
          activeOpacity={0.7}
        >
          <Text style={[styles.searchButtonText, { color: theme.colors.textInverse }]}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    paddingVertical: 0,
  },
  searchButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  searchButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BibleSearchBar;
