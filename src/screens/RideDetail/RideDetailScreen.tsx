import { IconSymbol } from '@/components/ui/icon-symbol';
import { RatingModal } from '@/src/components/RatingModal';
import { Colors } from '@/src/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { RideService } from '@/src/services/rideService';
import { UserService } from '@/src/services/userService';
import { Ride } from '@/src/types/ride';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './RideDetailScreen.styles';

export default function RideDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchRide = async () => {
      if (typeof id === 'string') {
        const result = await RideService.getRideById(id);
        if (result.success && result.data) {
          setRide(result.data);
        } else {
          Alert.alert('Hata', 'İlan bulunamadı.');
          router.back();
        }
        setLoading(false);
      }
    };
    fetchRide();
  }, [id]);

  const handleStatusUpdate = async (newStatus: 'completed' | 'cancelled') => {
    Alert.alert(
      newStatus === 'completed' ? 'Yolculuğu Tamamla' : 'İptal Et',
      newStatus === 'completed' 
        ? 'Yolculuk sona erdi mi? Ücretler toplanacak.' 
        : 'Bu ilanı iptal etmek istediğine emin misin?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Onayla',
          style: newStatus === 'cancelled' ? 'destructive' : 'default',
          onPress: async () => {
            setUpdating(true);
            const result = await RideService.updateRideStatus(ride!.id!, newStatus);
            setUpdating(false);

            if (result.success) {
              Alert.alert('Başarılı', 'Yolculuk durumu güncellendi.', [
                { text: 'Tamam', onPress: () => router.back() }
              ]);
            } else {
              Alert.alert('Hata', 'İşlem başarısız oldu.');
            }
          }
        }
      ]
    );
  };

  const handleJoin = async () => {
    if (!ride || !user) return;

    if (ride.driverId === user.uid) {
      Alert.alert('Hata', 'Kendi oluşturduğunuz ilana katılamazsınız.');
      return;
    }

    setJoining(true);
    const result = await RideService.joinRide(ride.id!, user.uid);
    setJoining(false);

    if (result.success) {
      Alert.alert('Başarılı', 'Yolculuğa katıldınız! Sürücü ile iletişime geçebilirsiniz.', [
        { text: 'Tamam', onPress: () => router.back() }
      ]);
    } else {
      Alert.alert('Hata', result.error || 'Bir sorun oluştu.');
    }
  };

  const handleLeave = () => {
    Alert.alert(
      'Yolculuktan Ayrıl',
      'Bu yolculuktan kaydını silmek istediğine emin misin?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        { 
          text: 'Evet, Ayrıl', 
          style: 'destructive',
          onPress: async () => {
            setJoining(true);
            const result = await RideService.leaveRide(ride!.id!, user!.uid);
            setJoining(false);

            if (result.success) {
              Alert.alert('Bilgi', 'Yolculuktan ayrıldınız.', [
                { text: 'Tamam', onPress: () => router.back() }
              ]);
            } else {
              Alert.alert('Hata', 'Bir sorun oluştu.');
            }
          }
        }
      ]
    );
  };

  const handleRatingSubmit = async (rating: number, comment: string) => {
    if (!ride || !user) return;

    setRatingLoading(true);
    const result = await UserService.rateDriver(ride.driverId, user.uid, rating, comment);
    setRatingLoading(false);

    if (result.success) {
      setShowRatingModal(false);
      Alert.alert('Teşekkürler', 'Puanınız kaydedildi.');
    } else {
      Alert.alert('Hata', 'Puanlama sırasında bir sorun oluştu.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (!ride) return null;

  const date = new Date(ride.departureTime);
  const dateStr = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
  const timeStr = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  
  const isFull = ride.availableSeats === 0;
  const isJoined = user ? ride.passengers.includes(user.uid) : false;
  const isOwner = user ? ride.driverId === user.uid : false;

  let buttonText = "Yolculuğa Katıl";
  let buttonDisabled = false;

  if (isOwner) {
    buttonText = "Sizin İlanınız";
    buttonDisabled = true;
  } else if (isJoined) {
    buttonText = "Katıldınız";
    buttonDisabled = true;
  } else if (isFull) {
    buttonText = "Koltuk Dolu";
    buttonDisabled = true;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="arrow.left" size={28} color={Colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Yolculuk Detayı</Text>
        </View>

        {/* FİYAT VE ROTA */}
        <View style={styles.mainCard}>
          <Text style={styles.price}>₺{ride.price}</Text>
          <Text style={styles.perPerson}>Kişi Başı</Text>
          
          <View style={styles.routeRow}>
            <View style={styles.locationContainer}>
              <Text style={styles.locationLabel}>KALKIŞ</Text>
              <Text style={styles.locationText}>{ride.origin}</Text>
            </View>
            <IconSymbol name="arrow.right" size={20} color={Colors.textLight} style={styles.arrowIcon} />
            <View style={styles.locationContainer}>
              <Text style={styles.locationLabel}>VARIŞ</Text>
              <Text style={styles.locationText}>{ride.destination}</Text>
            </View>
          </View>
        </View>

        {/* BİLGİLER */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <IconSymbol name="clock.fill" size={24} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Zaman</Text>
              <Text style={styles.infoValue}>{dateStr}, {timeStr}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <IconSymbol name="person.fill" size={24} color={Colors.secondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Sürücü</Text>
              <Text style={styles.infoValue}>{ride.driverName}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <IconSymbol name="car.fill" size={24} color={Colors.textDark} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Araç</Text>
              <Text style={styles.infoValue}>{ride.driverCarModel} ({ride.driverPlate})</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <IconSymbol name="person.2.fill" size={24} color={isFull ? Colors.error : Colors.success} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Müsaitlik</Text>
              <Text style={[styles.infoValue, { color: isFull ? Colors.error : Colors.success }]}>
                {ride.availableSeats} koltuk kaldı
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {/* DÜZELTME: Sohbet butonu sadece yolculuk AKTİF ise görünür */}
        {(isOwner || isJoined) && ride.status === 'active' && (
          <TouchableOpacity 
            style={[styles.joinButton, { backgroundColor: Colors.secondary, marginBottom: 12, height: 56 }]} 
            onPress={() => router.push(`/chat/${ride.id}`)}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <IconSymbol name="bubble.left.fill" size={20} color="#FFF" />
              <Text style={styles.joinButtonText}>Sohbet</Text>
            </View>
          </TouchableOpacity>
        )}

        {isOwner ? (
          <View style={{ gap: 12 }}>
             {ride.status === 'active' ? (
               <>
                 <TouchableOpacity 
                   style={[styles.joinButton, { backgroundColor: Colors.success }]} 
                   onPress={() => handleStatusUpdate('completed')}
                   disabled={updating}
                 >
                   <Text style={styles.joinButtonText}>Yolculuğu Tamamla</Text>
                 </TouchableOpacity>
                 
                 <TouchableOpacity 
                   style={[styles.joinButton, { backgroundColor: Colors.error, height: 48 }]} 
                   onPress={() => handleStatusUpdate('cancelled')}
                   disabled={updating}
                 >
                   <Text style={[styles.joinButtonText, { fontSize: 16 }]}>İlanı İptal Et</Text>
                 </TouchableOpacity>
               </>
             ) : (
               <View style={[styles.joinButton, styles.joinButtonDisabled]}>
                 <Text style={styles.joinButtonText}>
                   {ride.status === 'completed' ? 'Tamamlandı' : 'İptal Edildi'}
                 </Text>
               </View>
             )}
          </View>
        ) : (
          <>
            {ride.status === 'completed' && isJoined ? (
              <TouchableOpacity 
                style={[styles.joinButton, { backgroundColor: Colors.warning }]} 
                onPress={() => setShowRatingModal(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.joinButtonText}>Sürücüyü Puanla</Text>
              </TouchableOpacity>
            ) : (
              <>
                {isJoined ? (
                  <TouchableOpacity 
                    style={[styles.joinButton, { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: Colors.error }]}
                    onPress={handleLeave}
                    disabled={joining}
                    activeOpacity={0.8}
                  >
                    {joining ? (
                      <ActivityIndicator color={Colors.error} />
                    ) : (
                      <Text style={[styles.joinButtonText, { color: Colors.error }]}>Yolculuktan Ayrıl</Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={[styles.joinButton, buttonDisabled && styles.joinButtonDisabled]} 
                    onPress={handleJoin}
                    disabled={buttonDisabled || joining}
                    activeOpacity={0.8}
                  >
                    {joining ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <Text style={styles.joinButtonText}>{buttonText}</Text>
                    )}
                  </TouchableOpacity>
                )}
              </>
            )}
          </>
        )}
      </View>

      <RatingModal 
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        loading={ratingLoading}
      />
    </SafeAreaView>
  );
}