// Main App Layout with Auth Provider
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Tab screens */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Artist screens */}
        <Stack.Screen name="artist/login" options={{ title: 'Artist Login' }} />
        <Stack.Screen name="artist/register" options={{ title: 'Artist Register' }} />
        <Stack.Screen name="artist/dashboard" options={{ title: 'Artist Dashboard' }} />
        <Stack.Screen name="artist/profile" options={{ title: 'Artist Profile' }} />
        
        {/* Shop screens - handled by tabs, detail screens defined in stack */}
        <Stack.Screen name="shop/craft/[id]" options={{ title: 'Craft Details' }} />
        <Stack.Screen name="shop/crafts/add" options={{ title: 'Add Product' }} />
        
        {/* Cart */}
        {/* Note: Cart is now defined in (tabs)/_layout.tsx as a tab screen */}
      </Stack>
    </AuthProvider>
  );
}
