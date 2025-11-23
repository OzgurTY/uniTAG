// app/_layout.tsx

import { Colors } from '@/src/constants/colors';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Yönlendirme Mantığını İçeren Ana Bileşen
const MainLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth' || segments[0] === 'index'; // Auth veya Welcome ekranında mı?
    const inTabsGroup = segments[0] === '(tabs)'; // Ana sayfada mı?

    if (isAuthenticated && !inTabsGroup) {
      // Giriş yapmış ama login ekranındaysa -> Ana sayfaya at
      router.replace('/(tabs)/home'); 
    } else if (!isAuthenticated && inTabsGroup) {
      // Giriş yapmamış ama ana sayfadaysa -> Welcome ekranına at
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, segments]);

  // Firebase durumu kontrol ederken bekleme ekranı göster
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Her şey yüklendiyse normal akışa devam et
  return <Slot />;
};

// Uygulamanın Kökü (Root)
export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <MainLayout />
    </AuthProvider>
  );
}