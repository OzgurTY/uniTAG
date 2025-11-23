import { IconSymbol } from '@/components/ui/icon-symbol'; // Expo sembollerini kullanıyoruz
import { Colors } from '@/src/constants/colors';
import React from 'react';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './WelcomeScreen.styles';

export default function WelcomeScreen() {
  
  const handleLoginPress = () => {
    console.log("Login pressed");
  };

  const handleRegisterPress = () => {
    console.log("Register pressed");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.container}>
        {/* ÜST BÖLÜM: Logo ve Başlık */}
        <View style={styles.topSection}>
          {/* uniTAG Logosu */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoTextUni}>uni</Text>
            <Text style={styles.logoTextTag}>TAG</Text>
          </View>

          {/* Görsel Placeholder (Modern, minimalist bir ikon ile) */}
          <View style={styles.illustrationContainer}>
            <View style={styles.illustrationCircle}>
               <IconSymbol name="paperplane.fill" size={80} color={Colors.primary} />
            </View>
          </View>

          {/* Dokümandan alınan güçlü sloganlar */}
          <Text style={styles.tagline}>
            Kampüsüne Ulaşmanın{'\n'}Akıllı Yolu
          </Text>
          
          <Text style={styles.description}>
            Paradan tasarruf et, emisyonu azalt ve yolculuk sırasında yeni arkadaşlar edin. 
            Sadece üniversitelilere özel.
          </Text>
        </View>

        {/* ALT BÖLÜM: Butonlar */}
        <View style={styles.bottomSection}>
          <TouchableOpacity 
            style={styles.buttonPrimary} 
            onPress={handleLoginPress}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonPrimaryText}>Giriş Yap</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.buttonSecondary} 
            onPress={handleRegisterPress}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonSecondaryText}>Hesap Oluştur</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            uniTAG © 2025 - Öğrenci Dostu Ulaşım
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}