// src/screens/HomeScreen.js

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
// Çıkış işlemi için Firebase auth fonksiyonunu ekleyelim
import { signOut } from "firebase/auth";
import { auth } from '../firebaseConfig';
// --- YENİ EKLENEN KISIM ---
// Harita bileşenini içe aktaralım
import MapView from 'react-native-maps';
// ---------------------------

// Renk Paletimiz (Tutarlılık için)
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
      navigation.replace('Login'); 
    } catch (error) {
      Alert.alert('Hata', 'Çıkış yapılırken bir sorun oluştu.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* --- HARİTA BÖLÜMÜ --- */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          // Başlangıç konumu (Örn: İstanbul, Beşiktaş)
          initialRegion={{
            latitude: 41.0422,
            longitude: 29.0077,
            latitudeDelta: 0.0922, // Yakınlaştırma seviyesi (daha küçük değer = daha yakın)
            longitudeDelta: 0.0421,
          }}
        />
      </View>
      {/* ----------------------- */}
      
      {/* Bilgi ve Buton Bölümü */}
      <View style={styles.bottomContainer}>
        <View style={styles.infoBox}>
           <Text style={styles.infoText}>Giriş yapan kullanıcı: {auth.currentUser?.email}</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.buttonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

// Stiller
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // --- HARİTA STİLLERİ ---
  mapContainer: {
    flex: 1, // Ekranın geri kalanını kapla
    borderRadius: 20, // Köşeleri yuvarlat (modern görünüm)
    overflow: 'hidden', // Taşan kısımları gizle
    margin: 10, // Kenarlardan boşluk bırak
    // Harita kutusuna gölge efekti
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  // -----------------------
  bottomContainer: {
    padding: 20,
    backgroundColor: colors.white, // Alt kısım beyaz olsun
    borderTopLeftRadius: 20, // Üst köşeleri yuvarlat
    borderTopRightRadius: 20,
    // Üst kısma hafif bir gölge
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 10,
  },
  infoBox: {
    marginBottom: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    fontStyle: 'italic',
  },
  signOutButton: {
    width: '100%',
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
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