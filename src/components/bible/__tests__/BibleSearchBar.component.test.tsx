import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import BibleSearchBar from '../BibleSearchBar';

// Mock the Alert module
const mockAlert = Alert.alert as jest.MockedFunction<typeof Alert.alert>;

describe('BibleSearchBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const mockOnSearch = jest.fn();
    const { getByPlaceholderText, getByText } = render(<BibleSearchBar onSearch={mockOnSearch} />);

    expect(getByPlaceholderText('Enter reference (e.g., John 3 or Romans 1:1-16)')).toBeTruthy();
    expect(getByText('Search')).toBeTruthy();
  });

  it('renders with custom placeholder', () => {
    const mockOnSearch = jest.fn();
    const customPlaceholder = 'Search Bible passages';
    const { getByPlaceholderText } = render(
      <BibleSearchBar onSearch={mockOnSearch} placeholder={customPlaceholder} />,
    );

    expect(getByPlaceholderText(customPlaceholder)).toBeTruthy();
  });

  it('renders with initial value', () => {
    const mockOnSearch = jest.fn();
    const initialValue = 'John 3:16';
    const { getByDisplayValue } = render(
      <BibleSearchBar onSearch={mockOnSearch} value={initialValue} />,
    );

    expect(getByDisplayValue(initialValue)).toBeTruthy();
  });

  it('calls onChangeText when text is entered', () => {
    const mockOnSearch = jest.fn();
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <BibleSearchBar onSearch={mockOnSearch} onChangeText={mockOnChangeText} />,
    );

    const input = getByPlaceholderText('Enter reference (e.g., John 3 or Romans 1:1-16)');
    fireEvent.changeText(input, 'Romans 1:1');

    expect(mockOnChangeText).toHaveBeenCalledWith('Romans 1:1');
  });

  it('calls onSearch when search button is pressed with valid input', () => {
    const mockOnSearch = jest.fn();
    const { getByPlaceholderText, getByText } = render(<BibleSearchBar onSearch={mockOnSearch} />);

    const input = getByPlaceholderText('Enter reference (e.g., John 3 or Romans 1:1-16)');
    const searchButton = getByText('Search');

    fireEvent.changeText(input, 'John 3:16');
    fireEvent.press(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith('John 3:16');
  });

  it('calls onSearch when Enter key is pressed with valid input', () => {
    const mockOnSearch = jest.fn();
    const { getByPlaceholderText } = render(<BibleSearchBar onSearch={mockOnSearch} />);

    const input = getByPlaceholderText('Enter reference (e.g., John 3 or Romans 1:1-16)');

    fireEvent.changeText(input, 'Romans 1:1-16');
    fireEvent(input, 'submitEditing');

    expect(mockOnSearch).toHaveBeenCalledWith('Romans 1:1-16');
  });

  it('shows alert when search button is pressed with empty input', () => {
    const mockOnSearch = jest.fn();
    const { getByText } = render(<BibleSearchBar onSearch={mockOnSearch} />);

    const searchButton = getByText('Search');
    fireEvent.press(searchButton);

    expect(mockAlert).toHaveBeenCalledWith('Error', 'Please enter a Bible reference');
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('shows alert when Enter key is pressed with empty input', () => {
    const mockOnSearch = jest.fn();
    const { getByPlaceholderText } = render(<BibleSearchBar onSearch={mockOnSearch} />);

    const input = getByPlaceholderText('Enter reference (e.g., John 3 or Romans 1:1-16)');
    fireEvent(input, 'submitEditing');

    expect(mockAlert).toHaveBeenCalledWith('Error', 'Please enter a Bible reference');
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('trims whitespace from input before calling onSearch', () => {
    const mockOnSearch = jest.fn();
    const { getByPlaceholderText, getByText } = render(<BibleSearchBar onSearch={mockOnSearch} />);

    const input = getByPlaceholderText('Enter reference (e.g., John 3 or Romans 1:1-16)');
    const searchButton = getByText('Search');

    fireEvent.changeText(input, '  John 3:16  ');
    fireEvent.press(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith('John 3:16');
  });

  it('handles various Bible reference formats', async () => {
    const mockOnSearch = jest.fn();
    const { getByPlaceholderText, getByText } = render(<BibleSearchBar onSearch={mockOnSearch} />);

    const input = getByPlaceholderText('Enter reference (e.g., John 3 or Romans 1:1-16)');
    const searchButton = getByText('Search');

    const testCases = [
      'Genesis 1',
      'Exodus 20:1-17',
      'Psalm 23',
      'Matthew 5:1-12',
      'John 3:16',
      'Romans 1:1-16',
      'Revelation 21:1-4',
    ];

    for (const testCase of testCases) {
      fireEvent.changeText(input, testCase);
      fireEvent.press(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith(testCase);
      mockOnSearch.mockClear();
    }
  });
});
