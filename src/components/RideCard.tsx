import { IconSymbol } from '@/components/ui/icon-symbol'; // Düzeltilen Import
import { Colors } from '@/src/constants/colors';
import { Ride } from '@/src/types/ride';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RideCardProps {
  ride: Ride;
  onPress: () => void;
}

export function RideCard({ ride, onPress }: RideCardProps) {
  // Tarihi formatla (Örn: 14:30)
  const date = new Date(ride.departureTime);
  const timeString = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const dateString = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Sol Taraf: Saat ve Fiyat */}
      <View style={styles.leftSection}>
        <Text style={styles.time}>{timeString}</Text>
        <Text style={styles.date}>{dateString}</Text>
        <View style={styles.priceTag}>
          <Text style={styles.price}>₺{ride.price}</Text>
        </View>
      </View>

      {/* Orta Taraf: Rota ve Sürücü */}
      <View style={styles.centerSection}>
        {/* Rota Çizgisi */}
        <View style={styles.routeContainer}>
          <View style={styles.dot} />
          <View style={styles.line} />
          <View style={[styles.dot, styles.destinationDot]} />
          
          <View style={styles.locations}>
            <Text style={styles.locationText} numberOfLines={1}>{ride.origin}</Text>
            <Text style={styles.locationText} numberOfLines={1}>{ride.destination}</Text>
          </View>
        </View>

        {/* Sürücü Bilgisi */}
        <View style={styles.driverInfo}>
          <View style={styles.driverRow}>
            <IconSymbol name="person.fill" size={14} color={Colors.textMedium} />
            <Text style={styles.driverName} numberOfLines={1}>{ride.driverName}</Text>
            
            {/* YENİ: Puan Gösterimi */}
            <View style={styles.ratingBadge}>
              <IconSymbol name="star.fill" size={10} color={Colors.warning} />
              <Text style={styles.ratingText}>
                {ride.driverRating ? ride.driverRating.toFixed(1) : '5.0'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.seats}>{ride.availableSeats} boş koltuk</Text>
        </View>
      </View>

      {/* Sağ Taraf: Ok İkonu */}
      <View style={styles.rightSection}>
        <IconSymbol name="chevron.right" size={20} color={Colors.textLight} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  leftSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  time: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textDark,
  },
  date: {
    fontSize: 10,
    color: Colors.textMedium,
    marginBottom: 6,
  },
  priceTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    height: 40, // Rota çizgisinin yüksekliği
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textLight,
    marginTop: 6,
  },
  destinationDot: {
    backgroundColor: Colors.primary,
    marginTop: 'auto',
    marginBottom: 6,
  },
  line: {
    width: 1,
    backgroundColor: Colors.border,
    position: 'absolute',
    left: 3.5,
    top: 14,
    bottom: 14,
  },
  locations: {
    marginLeft: 12,
    justifyContent: 'space-between',
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: '500',
  },
  driverInfo: {
    justifyContent: 'space-between'
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  driverName: {
    fontSize: 12,
    color: Colors.textMedium,
    maxWidth: 80,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706', 
  },
  seats: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600',
  },
  rightSection: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
});