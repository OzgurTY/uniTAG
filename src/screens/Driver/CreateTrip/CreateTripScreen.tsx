import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/src/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { RideService } from '@/src/services/rideService';
import { UserService } from '@/src/services/userService'; // Profil bilgisini almak için
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './CreateTripScreen.styles';

export default function CreateTripScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [price, setPrice] = useState('');
  const [seats, setSeats] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleCreate = async () => {
    if (!origin || !destination || !price || !seats) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (!user) return;

    setLoading(true);

    // Sürücünün güncel bilgilerini (Araba, İsim) alalım
    const userProfile = await UserService.getUserProfile(user.uid);
    
    if (!userProfile.success || !userProfile.data || !userProfile.data.driverDetails) {
      setLoading(false);
      Alert.alert('Hata', 'Sürücü profilinize ulaşılamadı.');
      return;
    }

    const rideData = {
      driverId: user.uid,
      driverName: userProfile.data.fullName,
      driverCarModel: userProfile.data.driverDetails.carModel,
      driverPlate: userProfile.data.driverDetails.plateNumber,
      origin,
      destination,
      departureTime: date.toISOString(),
      price: parseInt(price),
      totalSeats: parseInt(seats),
      availableSeats: parseInt(seats),
      passengers: [],
      status: 'active' as const,
      createdAt: new Date().toISOString(),
    };

    const result = await RideService.createRide(rideData);
    setLoading(false);

    if (result.success) {
      Alert.alert('İlan Yayında!', 'Yolculuk başarıyla oluşturuldu.', [
        { text: 'Tamam', onPress: () => router.back() }
      ]);
    } else {
      Alert.alert('Hata', 'İlan oluşturulurken bir sorun oldu.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="arrow.left" size={28} color={Colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Yeni Yolculuk</Text>
        </View>

        {/* ROTA */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nereden?</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Örn: Kampüs Ana Kapı"
              placeholderTextColor={Colors.textMedium}
              value={origin}
              onChangeText={setOrigin}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nereye?</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Örn: Beşiktaş Meydan"
              placeholderTextColor={Colors.textMedium}
              value={destination}
              onChangeText={setDestination}
            />
          </View>
        </View>

        {/* TARİH & SAAT */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ne Zaman?</Text>
          <TouchableOpacity 
            style={styles.inputWrapper} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {date.toLocaleDateString('tr-TR')} - {date.toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* FİYAT & KOLTUK (Yan Yana) */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>Ücret (Kişi Başı)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="₺ 50"
                placeholderTextColor={Colors.textMedium}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>
          </View>

          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.label}>Boş Koltuk</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="3"
                placeholderTextColor={Colors.textMedium}
                keyboardType="numeric"
                value={seats}
                onChangeText={setSeats}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.createButton, loading && { opacity: 0.7 }]}
          onPress={handleCreate}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.createButtonText}>İlanı Yayınla</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}