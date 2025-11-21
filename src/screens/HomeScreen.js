// src/screens/HomeScreen.js

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
// Çıkış işlemi için Firebase auth fonksiyonunu ekleyelim
import { signOut } from "firebase/auth";
import { auth } from '../firebaseConfig';

// Renk Paletimiz (LoginScreen ile tutarlı olması için)
const colors = {
  background: '#fefbf6',
  primary: '#00c49a',
  accent: '#ff6b6b',
  text: '#2c3e50',
  white: '#ffffff',
};

const HomeScreen = ({ navigation }) => {
  // Çıkış Yap butonuna basıldığında çalışacak fonksiyon
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Başarılı olursa, kullanıcıyı Giriş Ekranı'na geri gönderelim.
      // replace() kullanarak geri butonuna basıldığında tekrar Ana Sayfa'ya dönmesini engelliyoruz.
      navigation.replace('Login'); 
    } catch (error) {
      Alert.alert('Hata', 'Çıkış yapılırken bir sorun oluştu.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Geçici İçerik */}
      <View style={styles.content}>
        <Text style={styles.title}>Ana Sayfa</Text>
        <Text style={styles.subtitle}>Harita ve Yolculuklar Burada Olacak</Text>
        <Text style={styles.infoText}>Giriş yapan kullanıcı: {auth.currentUser?.email}</Text>
      </View>

      {/* Çıkış Yap Butonu */}
      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

// Stiller
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'space-between', // İçeriği ve butonu alt/üst uçlara it
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 30,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 20,
    fontStyle: 'italic',
  },
  signOutButton: {
    width: '100%',
    backgroundColor: colors.accent, // Çıkış için kırmızı/mercan rengi
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    // Gölge efekti
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
});