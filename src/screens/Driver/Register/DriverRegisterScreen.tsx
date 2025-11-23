import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/src/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { UserService } from '@/src/services/userService';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './DriverRegisterScreen.styles';

export default function DriverRegisterScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [carModel, setCarModel] = useState('');
  const [carColor, setCarColor] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!carModel || !carColor || !plateNumber) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm araç bilgilerini doldurun.');
      return;
    }

    if (!user) return;

    setLoading(true);

    // Servisi çağır
    const result = await UserService.registerDriver(user.uid, {
      carModel,
      carColor,
      plateNumber: plateNumber.toUpperCase()
    });

    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Tebrikler!', 
        'Sürücü kaydın başarıyla oluşturuldu. Artık ilan verebilirsin.',
        [{ text: 'Tamam', onPress: () => router.back() }] // Geri dönünce Home ekranı güncellenecek
      );
    } else {
      Alert.alert('Hata', 'Kayıt sırasında bir sorun oluştu.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="arrow.left" size={28} color={Colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.title}>Sürücü Ol</Text>
          <Text style={styles.subtitle}>
            Aracını kaydet, yol masraflarını paylaşmaya başla.
          </Text>
        </View>

        {/* FORM */}
        <View style={styles.formContainer}>
          
          {/* Araç Modeli */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Araç Marka / Model</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Örn: Fiat Egea"
                placeholderTextColor={Colors.textMedium}
                value={carModel}
                onChangeText={setCarModel}
              />
            </View>
          </View>

          {/* Araç Rengi */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Araç Rengi</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Örn: Beyaz"
                placeholderTextColor={Colors.textMedium}
                value={carColor}
                onChangeText={setCarColor}
              />
            </View>
          </View>

          {/* Plaka */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Plaka</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.plateInput]}
                placeholder="34AB123"
                placeholderTextColor={Colors.textMedium}
                value={plateNumber}
                onChangeText={setPlateNumber}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Kaydı Tamamla</Text>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}