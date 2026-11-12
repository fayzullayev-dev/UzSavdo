import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../src/lib/auth';
import { I18nProvider } from '../src/lib/i18n';
import { ToastProvider } from '../src/components/TopToast';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <I18nProvider>
            <ToastProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="auth" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
                <Stack.Screen name="listing/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="profile" options={{ headerShown: false }} />
                <Stack.Screen name="contracts" options={{ headerShown: false }} />
                <Stack.Screen name="messages" options={{ headerShown: false }} />
                <Stack.Screen name="notifications" options={{ headerShown: false }} />
                <Stack.Screen name="favorites" options={{ headerShown: false }} />
                <Stack.Screen name="ratings" options={{ headerShown: false }} />
                <Stack.Screen name="help" options={{ headerShown: false }} />
              </Stack>
            </ToastProvider>
          </I18nProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
