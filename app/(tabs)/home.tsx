import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/src/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { AuthService } from '@/src/services/authService';
import { UserService } from '@/src/services/userService';
import { UserProfile } from '@/src/types/user';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDriverMode, setIsDriverMode] = useState(false); // Sürücü modu anahtarı
  const router = useRouter();

  // Kullanıcı profilini veritabanından çek
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const result = await UserService.getUserProfile(user.uid);
        if (result.success && result.data) {
          setProfile(result.data);
        }
        setLoading(false);
      };
      fetchProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    await AuthService.logout();
  };

  const toggleDriverMode = () => {
    // Eğer zaten sürücü modundaysa, yolcu moduna geç (sorun yok)
    if (isDriverMode) {
      setIsDriverMode(false);
      return;
    }

    // Sürücü modunu açmak istiyor, kontrol et: Araç bilgisi var mı?
    if (profile?.driverDetails && profile.driverDetails.plateNumber) {
      // Kayıtlı sürücü, izin ver
      setIsDriverMode(true);
    } else {
      // Kayıtlı değil, kayıt ekranına yönlendir
      Alert.alert(
        "Sürücü Kaydı Gerekiyor",
        "Sürücü moduna geçmek için önce araç bilgilerini girmelisin.",
        [
          { text: "Vazgeç", style: "cancel" },
          { text: "Kaydol", onPress: () => router.push('/driver/register') }
        ]
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ÜST HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Merhaba,</Text>
          <Text style={styles.userName}>{profile?.fullName || 'Öğrenci'}</Text>
          <Text style={styles.university}>{profile?.university}</Text>
        </View>
        
        {/* Sürücü Modu Switch'i */}
        <View style={styles.modeSwitchContainer}>
          <Text style={styles.modeLabel}>{isDriverMode ? 'Sürücü' : 'Yolcu'}</Text>
          <Switch
            trackColor={{ false: '#767577', true: Colors.primary }}
            thumbColor={'#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleDriverMode}
            value={isDriverMode}
          />
        </View>
      </View>

      <View style={styles.content}>
        {/* DURUMA GÖRE İÇERİK */}
        {isDriverMode ? (
          // SÜRÜCÜ MODU İÇERİĞİ
          <View style={styles.driverCard}>
            <View style={styles.iconContainer}>
              <IconSymbol name="car.fill" size={32} color="#FFF" />
            </View>
            <Text style={styles.cardTitle}>Yolculuk Oluştur</Text>
            <Text style={styles.cardDesc}>Aracındaki boş koltukları paylaş, masraflarını azalt.</Text>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>İlan Ver</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // YOLCU MODU İÇERİĞİ
          <View style={styles.passengerCard}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.secondary }]}>
              <IconSymbol name="map.fill" size={32} color="#FFF" />
            </View>
            <Text style={styles.cardTitle}>Yolculuk Bul</Text>
            <Text style={styles.cardDesc}>Kampüsüne giden en rahat ve uygun yolu bul.</Text>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.secondary }]}>
              <Text style={styles.actionButtonText}>Ara</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Çıkış Butonu (Geçici olarak burada) */}
        <TouchableOpacity style={styles.logoutLink} onPress={handleLogout}>
          <Text style={styles.logoutText}>Oturumu Kapat</Text>
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
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textMedium,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textDark,
  },
  university: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  modeSwitchContainer: {
    alignItems: 'center',
    gap: 4,
  },
  modeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMedium,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  // KART TASARIMLARI
  driverCard: {
    backgroundColor: Colors.primary, // Sürücü için Mavi
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  passengerCard: {
    backgroundColor: '#FFFFFF', // Yolcu için Beyaz
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF', // Passenger için bunu override edeceğiz
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 100,
  },
  actionButtonText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  // Override styles for Passenger Card texts
  passengerCardTitle: {
    color: Colors.textDark,
  },
  passengerCardDesc: {
    color: Colors.textMedium,
  },
  logoutLink: {
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  logoutText: {
    color: Colors.error,
    fontWeight: '600',
  }
});