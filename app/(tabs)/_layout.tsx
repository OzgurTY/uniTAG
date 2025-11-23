// app/(tabs)/_layout.tsx
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        // Tab Bar görünümünü biraz güzelleştirelim
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute', // Yüzen efekt için
            bottom: 20,
            left: 20,
            right: 20,
            borderRadius: 20,
            height: 60,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            paddingBottom: 0, // iOS safe area düzeltmesi
          },
          default: {},
        }),
      }}>
      
      {/* ANA SAYFA */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      {/* YOLCULUKLARIM (Eski Explore yerine) */}
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Yolculuklarım',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}