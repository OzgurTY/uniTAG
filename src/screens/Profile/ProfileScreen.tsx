import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/src/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { AuthService } from '@/src/services/authService';
import { UserService } from '@/src/services/userService';
import { UserProfile } from '@/src/types/user';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ProfileScreen.styles';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Profil verilerini çek
  useFocusEffect(
    useCallback(() => {
      if (user) {
        UserService.getUserProfile(user.uid).then((res) => {
          if (res.success && res.data) {
            setProfile(res.data);
          }
          setLoading(false);
        });
      }
    }, [user])
  );

  const handleLogout = async () => {
    await AuthService.logout();
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  // İsim baş harflerini al (Örn: Ali Yılmaz -> AY)
  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER: Avatar ve İsim */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={{ position: 'absolute', top: 60, right: 24, zIndex: 10 }}
          onPress={() => router.push('/profile/edit')}
        >
          <IconSymbol name="gearshape.fill" size={24} color={Colors.textMedium} />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          <Text style={styles.initials}>{getInitials(profile?.fullName || '')}</Text>
        </View>
        <Text style={styles.name}>{profile?.fullName}</Text>
        <Text style={styles.university}>{profile?.university}</Text>

        {/* İstatistikler (Şimdilik statik, sonra dinamik yapacağız) */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            {/* Puan varsa göster, yoksa varsayılan 5.0 veya - */}
            <Text style={styles.statValue}>
              {profile?.rating ? profile.rating.toFixed(1) : '5.0'}
            </Text>
            <Text style={styles.statLabel}>Puan</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statItem}>
            {/* Yolculuk sayısı varsa göster, yoksa 0 */}
            <Text style={styles.statValue}>
              {profile?.rideCount || 0}
            </Text>
            <Text style={styles.statLabel}>Yolculuk</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* KİŞİSEL BİLGİLER */}
        <Text style={styles.sectionTitle}>Hesap Bilgileri</Text>
        
        <View style={styles.infoCard}>
          <IconSymbol name="envelope.fill" size={24} color={Colors.textMedium} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>E-posta</Text>
            <Text style={styles.infoValue}>{profile?.email}</Text>
          </View>
        </View>

        {/* SÜRÜCÜ BİLGİLERİ (Sadece sürücüyse göster) */}
        {profile?.role === 'driver' && profile.driverDetails && (
          <>
            <Text style={styles.sectionTitle}>Araç Bilgileri</Text>
            <View style={styles.infoCard}>
              <IconSymbol name="car.fill" size={24} color={Colors.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Araç</Text>
                <Text style={styles.infoValue}>
                  {profile.driverDetails.carModel} • {profile.driverDetails.carColor}
                </Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <IconSymbol name="number.square.fill" size={24} color={Colors.textDark} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Plaka</Text>
                <Text style={styles.infoValue}>{profile.driverDetails.plateNumber}</Text>
              </View>
            </View>
          </>
        )}

        {/* ÇIKIŞ BUTONU */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Oturumu Kapat</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}