import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import BibleStudy from './src/pages/BibleStudy';

export default function App() {
  return (
    <View style={styles.container}>
      <BibleStudy />
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
