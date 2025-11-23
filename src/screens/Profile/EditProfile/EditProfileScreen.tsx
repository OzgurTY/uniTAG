import { Colors } from '@/src/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { UserService } from '@/src/services/userService';
import { UserProfile } from '@/src/types/user';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './EditProfileScreen.styles';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carColor, setCarColor] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  
  // Read-only data
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [isDriver, setIsDriver] = useState(false);

  // Verileri Çek
  useEffect(() => {
    if (user) {
      UserService.getUserProfile(user.uid).then((res) => {
        if (res.success && res.data) {
          const data = res.data;
          setFullName(data.fullName);
          setEmail(data.email);
          setUniversity(data.university);
          setIsDriver(data.role === 'driver');
          
          if (data.driverDetails) {
            setCarModel(data.driverDetails.carModel);
            setCarColor(data.driverDetails.carColor);
            setPlateNumber(data.driverDetails.plateNumber);
          }
        }
        setLoading(false);
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const updateData: Partial<UserProfile> = {
      fullName,
    };

    if (isDriver) {
      updateData.driverDetails = {
        carModel,
        carColor,
        plateNumber: plateNumber.toUpperCase(),
        verified: true // Şimdilik otomatik onaylı
      };
    }

    const result = await UserService.updateUserProfile(user.uid, updateData);
    setSaving(false);

    if (result.success) {
      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.', [
        { text: 'Tamam', onPress: () => router.back() }
      ]);
    } else {
      Alert.alert('Hata', 'Güncelleme sırasında bir sorun oluştu.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Hesabınızı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            setLoading(true);
            const result = await UserService.deleteAccount(user.uid);
            // AuthContext otomatik olarak çıkış yapıp login ekranına atacaktır.
            if (!result.success) {
              setLoading(false);
              Alert.alert('Hata', 'Hesap silinemedi. Lütfen tekrar giriş yapıp deneyin.');
            }
          }
        }
      ]
    );
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
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 16, color: Colors.textMedium }}>Vazgeç</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profili Düzenle</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Text style={styles.saveButtonText}>Kaydet</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* KİŞİSEL BİLGİLER */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ad Soyad</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-posta (Değiştirilemez)</Text>
            <View style={[styles.inputWrapper, styles.disabledInput]}>
              <TextInput
                style={styles.input}
                value={email}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Üniversite (Değiştirilemez)</Text>
            <View style={[styles.inputWrapper, styles.disabledInput]}>
              <TextInput
                style={styles.input}
                value={university}
                editable={false}
              />
            </View>
          </View>
        </View>

        {/* ARAÇ BİLGİLERİ (Sadece Sürücüler İçin) */}
        {isDriver && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Araç Bilgileri</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Marka / Model</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={carModel}
                  onChangeText={setCarModel}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Renk</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={carColor}
                  onChangeText={setCarColor}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Plaka</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={plateNumber}
                  onChangeText={setPlateNumber}
                  autoCapitalize="characters"
                />
              </View>
            </View>
          </View>
        )}

        {/* HESABI SİL BUTONU */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteButtonText}>Hesabımı Sil</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}