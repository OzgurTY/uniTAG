import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/src/constants/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { styles } from './SignUpScreen.styles';

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
          {/* 1. HEADER */}
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

          {/* 2. FORM */}
          <View style={styles.formContainer}>
            
            {/* İsim Input */}
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

            {/* E-posta Input */}
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
              
              {/* Bilgi Kutusu */}
              <View style={styles.infoBox}>
                <IconSymbol name="info.circle" size={20} color={Colors.primary} />
                <Text style={styles.infoText}>
                  Güvenliğin için sadece .edu.tr uzantılı e-postalarla kayıt olabilirsin.
                </Text>
              </View>
            </View>

            {/* Şifre Input */}
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
              style={styles.registerButton}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>Devam Et</Text>
            </TouchableOpacity>
          </View>

          {/* 3. FOOTER */}
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