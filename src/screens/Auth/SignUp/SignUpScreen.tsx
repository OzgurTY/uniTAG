import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/src/constants/colors';
import { AuthService } from '@/src/services/authService'; // Servisi ekledik
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView, Platform,
    SafeAreaView,
    ScrollView,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import { styles } from './SignUpScreen.styles';

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Yükleniyor durumu

  const handleRegister = async () => {
    // 1. Basit Validasyonlar
    if (!name || !email || !password) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }

    // 2. Üniversite E-postası Kontrolü (Niche özellik)
    if (!email.includes('.edu.tr')) {
      Alert.alert('Hata', 'Sadece .edu.tr uzantılı üniversite e-postaları ile kayıt olabilirsiniz.');
      return;
    }

    setLoading(true);

    // 3. Servis Çağrısı
    const result = await AuthService.signUp(email, password, name);
    
    setLoading(false);

    if (result.error) {
      Alert.alert('Kayıt Başarısız', result.error);
    } else {
      Alert.alert('Başarılı', 'Hesabınız oluşturuldu! Şimdi giriş yapabilirsiniz.', [
        { text: 'Tamam', onPress: () => router.replace('/auth/login') }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <IconSymbol name="arrow.left" size={24} color={Colors.textDark} />
            </TouchableOpacity>
            
            <Text style={styles.title}>Hesap Oluştur</Text>
            <Text style={styles.subtitle}>
              Sadece <Text style={styles.highlight}>üniversitelilere</Text> özel bu topluluğun bir parçası ol.
            </Text>
          </View>

          {/* FORM */}
          <View style={styles.formContainer}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ad Soyad</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Ali Yılmaz"
                  placeholderTextColor={Colors.textLight}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Okul E-postası</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="ogrenci@universite.edu.tr"
                  placeholderTextColor={Colors.textLight}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.infoBox}>
                <IconSymbol name="info.circle" size={20} color={Colors.primary} />
                <Text style={styles.infoText}>
                  Güvenlik için sadece .edu.tr uzantılı e-postalarla kayıt olabilirsin.
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="En az 6 karakter"
                  placeholderTextColor={Colors.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.registerButton, loading && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={handleRegister}
              disabled={loading} // Yüklenirken tıklamayı engelle
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.registerButtonText}>Devam Et</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Zaten üye misin?</Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.footerLink}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}