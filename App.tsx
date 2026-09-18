import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppDataProvider } from './src/context/AppDataContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppDataProvider>
        <RootNavigator />
        <StatusBar style="dark" />
      </AppDataProvider>
    </SafeAreaProvider>
  );
}
