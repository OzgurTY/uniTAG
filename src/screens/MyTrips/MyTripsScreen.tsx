import { IconSymbol } from '@/components/ui/icon-symbol';
import { RideCard } from '@/src/components/RideCard';
import { Colors } from '@/src/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { RideService } from '@/src/services/rideService';
import { Ride } from '@/src/types/ride';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './MyTripsScreen.styles';

type TabType = 'driver' | 'passenger';

export default function MyTripsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<TabType>('passenger');
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRides = async () => {
    if (!user) return;
    
    // Hangi sekmedeyse ona göre veri çek
    const result = activeTab === 'driver' 
      ? await RideService.getDriverRides(user.uid)
      : await RideService.getPassengerRides(user.uid);

    if (result.success && result.data) {
      setRides(result.data as Ride[]);
    }
    setLoading(false);
  };

  // Sayfa her odaklandığında veya Tab değiştiğinde çalışır
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchRides();
    }, [user, activeTab])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRides();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yolculuklarım</Text>
        
        {/* Sekmeler */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'passenger' && styles.activeTab]} 
            onPress={() => setActiveTab('passenger')}
          >
            <Text style={[styles.tabText, activeTab === 'passenger' && styles.activeTabText]}>Yolcu</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'driver' && styles.activeTab]} 
            onPress={() => setActiveTab('driver')}
          >
            <Text style={[styles.tabText, activeTab === 'driver' && styles.activeTabText]}>Sürücü</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => (
            <RideCard 
              ride={item} 
              onPress={() => router.push(`/ride/${item.id}`)} 
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <IconSymbol name="car.fill" size={48} color={Colors.border} />
              <Text style={styles.emptyText}>
                {activeTab === 'driver' 
                  ? 'Henüz oluşturduğunuz bir ilan yok.' 
                  : 'Henüz katıldığınız bir yolculuk yok.'}
              </Text>
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </SafeAreaView>
  );
}