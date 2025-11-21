import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { signOut } from "firebase/auth";
import { auth } from '../firebaseConfig';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// Renk Paleti
const colors = {
  background: '#fefbf6',
  primary: '#00c49a',
  accent: '#ff6b6b',
  text: '#2c3e50',
  white: '#ffffff',
};

const RoleToggle = ({ role, setRole }) => {
  return (
    <View style={toggleStyles.container}>
      {/* Sürücü Ol Butonu */}
      <TouchableOpacity
        style={[
          toggleStyles.button,
          role === 'driver' ? toggleStyles.driverActive : toggleStyles.inactive // Rol 'driver' ise aktif stilini uygula
        ]}
        onPress={() => setRole('driver')} // Tıklanınca rolü 'driver' yap
        activeOpacity={0.8} // Tıklama efekti
      >
        {/* İkon ekleyebiliriz (İleride) */}
        {/* <Ionicons name="car-sport" size={20} color={role === 'driver' ? colors.white : colors.text} /> */}
        <Text style={[
          toggleStyles.text,
          role === 'driver' ? toggleStyles.activeText : toggleStyles.inactiveText
        ]}>Sürücü Ol</Text>
      </TouchableOpacity>

      {/* Yolcu Ol Butonu */}
      <TouchableOpacity
        style={[
          toggleStyles.button,
          role === 'passenger' ? toggleStyles.passengerActive : toggleStyles.inactive // Rol 'passenger' ise aktif stilini uygula
        ]}
        onPress={() => setRole('passenger')} // Tıklanınca rolü 'passenger' yap
        activeOpacity={0.8}
      >
        {/* İkon ekleyebiliriz (İleride) */}
        {/* <Ionicons name="person" size={20} color={role === 'passenger' ? colors.white : colors.text} /> */}
        <Text style={[
          toggleStyles.text,
          role === 'passenger' ? toggleStyles.activeText : toggleStyles.inactiveText
        ]}>Yolcu Ol</Text>
      </TouchableOpacity>
    </View>
  );
};

// RoleToggle Bileşeninin Stilleri
const toggleStyles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Yan yana diz
    backgroundColor: colors.white,
    borderRadius: 30, // Tamamen yuvarlak köşeler (hap şeklinde)
    padding: 5, // İçeriden boşluk
    marginHorizontal: 20, // Yanlardan boşluk
    marginTop: 15, // Üstten boşluk
    marginBottom: 10, // Alttan boşluk (Harita ile arası)
    // Hafif gölge
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  button: {
    flex: 1, // Alanı eşit paylaş
    flexDirection: 'row', // İkon ve metni yan yana diz
    justifyContent: 'center', // İçeriği ortala
    alignItems: 'center',
    paddingVertical: 12, // Dikey dolgu
    borderRadius: 25, // Buton köşeleri
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8, // İkon ile metin arası boşluk (ikon eklenirse)
  },
  // Aktif Durum Stilleri
  driverActive: {
    backgroundColor: colors.primary, // Canlı Yeşil
  },
  passengerActive: {
    backgroundColor: colors.accent, // Sıcak Mercan
  },
  // Pasif Durum Stili
  inactive: {
    backgroundColor: 'transparent', // Şeffaf arka plan
  },
  // Metin Renkleri
  activeText: {
    color: colors.white, // Aktifken beyaz metin
  },
  inactiveText: {
    color: colors.text, // Pasifken koyu metin
  },
});

const HomeScreen = ({ navigation }) => {
  const [role, setRole] = React.useState('passenger');
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      // 1. Konum izni iste
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Konum izni reddedildi. Uygulamayı kullanmak için lütfen ayarlardan izin verin.');
        Alert.alert('İzin Gerekli', 'Haritayı kullanabilmek için konum izni vermeniz gerekiyor.');
        return;
      }

      // 2. İzin verildiyse, anlık konumu al
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // 3. Haritayı alınan konuma odakla (animateToRegion)
      if (mapRef.current && currentLocation) {
        mapRef.current.animateToRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01, // Yakınlaştırma seviyesi (Daha yakın)
          longitudeDelta: 0.01,
        }, 1000); // 1 saniyede animasyonla git
      }
    })();
  }, []);

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

      {/* --- RoleToggle Bileşeni --- */}
      <RoleToggle role={role} setRole={setRole} />
      {/* --------------------------------------------- */}

      {/* HARİTA BÖLÜMÜ */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 41.0082,
            longitude: 28.9784,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title={"Konumum"}
              description={"Şu an buradasınız"}
            />
          )}
        </MapView>
        
        {errorMsg && (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
        )}
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
  errorContainer: {
    position: 'absolute', // Haritanın üzerine binmesi için
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 59, 48, 0.8)', // Yarı saydam kırmızı
    padding: 10,
    borderRadius: 8,
  },
  errorText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});