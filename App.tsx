import React from 'react';
import BibleStudy from './src/pages/BibleStudy';
import { ThemeProvider } from './src/theme';
import { NotesProvider } from './src/context/NotesProvider';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from './src/pages/Settings';

type RootStackParamList = {
  BibleStudy: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NotesProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="BibleStudy">
            <Stack.Screen
              name="BibleStudy"
              component={BibleStudy}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Settings" component={Settings} options={{ title: 'Settings' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </NotesProvider>
  );
}
