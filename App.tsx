import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import BibleStudy from './src/pages/BibleStudy';
import { ThemeProvider, useThemeContext } from './src/theme';

// Main App Content with theme context
const AppContent = () => {
  const { theme } = useThemeContext();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BibleStudy />
      <StatusBar style="auto" />
    </View>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
