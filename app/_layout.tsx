import { Colors } from '@/src/constants/colors';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { Stack, useRouter, useSegments } from 'expo-router'; // Slot yerine Stack kullandık
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const MainLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Hangi grupta olduğumuzu kontrol et
    const inAuthGroup = segments[0] === '(auth)' || segments[0] === 'auth';
    const inTabsGroup = segments[0] === '(tabs)';
    const inDriverGroup = segments[0] === 'driver'; // Sürücü klasörünü de tanıttık
    const isWelcomeScreen = segments.length === 0 || segments[0] === 'index';

    if (isAuthenticated) {
      // Giriş yapmış kullanıcı: Sadece Auth veya Welcome ekranındaysa Home'a at.
      // Eğer 'driver' veya 'tabs' grubundaysa dokunma.
      if (inAuthGroup || isWelcomeScreen) {
        router.replace('/(tabs)/home');
      }
    } else {
      // Giriş yapmamış kullanıcı: Korumalı alanlardaysa (Tabs, Driver) Welcome'a at.
      if (inTabsGroup || inDriverGroup) {
        router.replace('/');
      }
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Slot yerine Stack kullanıyoruz ki sayfalar üst üste binebilsin (Push navigation)
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/signup" />
      <Stack.Screen name="driver/register" />
      <Stack.Screen name="driver/create-trip" />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="profile/edit" options={{ presentation: 'modal' }} />
      <Stack.Screen name="chat/[id]" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <MainLayout />
    </AuthProvider>
  );
}