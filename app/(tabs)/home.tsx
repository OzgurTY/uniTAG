import { IconSymbol } from '@/components/ui/icon-symbol';
import { RideCard } from '@/src/components/RideCard'; // Eklendi
import { Colors } from '@/src/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { RideService } from '@/src/services/rideService'; // Eklendi
import { UserService } from '@/src/services/userService';
import { Ride } from '@/src/types/ride'; // Eklendi
import { UserProfile } from '@/src/types/user';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [rides, setRides] = useState<Ride[]>([]); // İlanlar için state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDriverMode, setIsDriverMode] = useState(false);

  // Verileri getiren ana fonksiyon
  const fetchData = async () => {
    if (user) {
      // 1. Profil Çek
      const userRes = await UserService.getUserProfile(user.uid);
      if (userRes.success && userRes.data) {
        setProfile(userRes.data);
      }

      // 2. İlanları Çek (Sadece yolcu modundaysa veya genel olarak çekebiliriz)
      const ridesRes = await RideService.getAvailableRides();
      if (ridesRes.success && ridesRes.data) {
        setRides(ridesRes.data as Ride[]);
      }
      
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [user])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const toggleDriverMode = () => {
    if (isDriverMode) {
      setIsDriverMode(false);
      return;
    }
    if (profile?.driverDetails && profile.driverDetails.plateNumber) {
      setIsDriverMode(true);
    } else {
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

  // Header Bileşeni (FlatList Header olarak kullanacağız)
  const ListHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Merhaba,</Text>
        <Text style={styles.userName}>{profile?.fullName || 'Öğrenci'}</Text>
        <Text style={styles.university}>{profile?.university}</Text>
      </View>
      
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
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isDriverMode ? (
        // SÜRÜCÜ MODU (Basit View olarak kalsın şimdilik)
        <>
          <ListHeader />
          <View style={styles.content}>
            <View style={styles.driverCard}>
              <View style={styles.iconContainer}>
                <IconSymbol name="car.fill" size={32} color="#FFF" />
              </View>
              <Text style={styles.cardTitle}>Yolculuk Oluştur</Text>
              <Text style={styles.cardDesc}>Aracındaki boş koltukları paylaş.</Text>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/driver/create-trip')}
              >
                <Text style={styles.actionButtonText}>İlan Ver</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        // YOLCU MODU (FlatList ile İlanlar)
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => (
            <RideCard 
              ride={item} 
              onPress={() => router.push(`/ride/${item.id}`)} 
            />
          )}
          ListHeaderComponent={() => (
            <>
              <ListHeader />
              <Text style={styles.sectionTitle}>Güncel İlanlar</Text>
            </>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Henüz aktif bir yolculuk ilanı yok.</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
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
    marginBottom: 16,
  },
  // ... (Diğer stiller öncekiyle aynı, sadece yenilerini ekliyorum)
  greeting: { fontSize: 14, color: Colors.textMedium },
  userName: { fontSize: 22, fontWeight: '800', color: Colors.textDark },
  university: { fontSize: 12, color: Colors.primary, fontWeight: '600', marginTop: 2 },
  modeSwitchContainer: { alignItems: 'center', gap: 4 },
  modeLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMedium, textTransform: 'uppercase' },
  
  content: { flex: 1, padding: 24, gap: 24 },
  listContent: { paddingBottom: 100 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    marginHorizontal: 24,
    marginBottom: 12,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textMedium,
    textAlign: 'center',
  },
  // Driver Card stilleri aynen kalsın...
  driverCard: { backgroundColor: Colors.primary, borderRadius: 24, padding: 24, alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  iconContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  cardDesc: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 20 },
  actionButton: { backgroundColor: '#FFF', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 100 },
  actionButtonText: { color: Colors.primary, fontWeight: '700', fontSize: 16 },
  logoutLink: { alignSelf: 'center', marginTop: 'auto', marginBottom: 20 },
  logoutText: { color: Colors.error, fontWeight: '600' }
});