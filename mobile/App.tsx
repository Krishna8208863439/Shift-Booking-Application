import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';
import { theme } from './src/theme';
import { ShiftProvider } from './src/context/ShiftContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ResponsiveContainer } from './src/components/ResponsiveContainer';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <ShiftProvider>
          <ResponsiveContainer>
            <NavigationContainer>
              <StatusBar style="dark" />
              <AppNavigator />
            </NavigationContainer>
          </ResponsiveContainer>
        </ShiftProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
