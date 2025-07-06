import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Settings from './src/pages/Settings';

export default function App() {
  return (
    <View style={styles.container}>
      <Settings />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
