// app/(tabs)/home.tsx

import { Colors } from '@/src/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { AuthService } from '@/src/services/authService';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await AuthService.logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Hoşgeldin!</Text>
        <Text style={styles.email}>{user?.email}</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardText}>Aktif Yolculuk Bulunamadı</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.textDark,
  },
  email: {
    fontSize: 16,
    color: Colors.textMedium,
    marginBottom: 32,
  },
  card: {
    width: '100%',
    padding: 24,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  cardText: {
    color: Colors.textMedium,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    color: Colors.error,
    fontWeight: '600',
  }
});