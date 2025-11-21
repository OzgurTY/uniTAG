// src/screens/LoginScreen.js

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebaseConfig';

// Logomuzu veya bir ikonu daha sonra ekleyebiliriz
// import Logo from '../assets/icon.png';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Hata', 'Lütfen e-posta ve şifrenizi giriniz.');
      return;
    }

    // 2. E-posta uzantı kontrolü (Sadece .edu.tr)
    // NOT: Bu kontrolü şimdilik yorum satırı yapıyorum ki test ederken herhangi bir mail ile deneyebilelim.
    // Proje bitiminde bu yorumu kaldıracağız.
    /*
    if (!email.endsWith('.edu.tr')) {
      Alert.alert('Hata', 'Sadece öğrenci e-postası (...@edu.tr) ile giriş yapabilirsiniz.');
      return;
    }
    */

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Giriş başarılı:', user.email);
      
      navigation.replace('Home');

    } catch (error) {
      // 5. Giriş Başarısız (Hata Yakalama)
      console.error('Giriş hatası:', error.message);
      
      // Hata koduna göre kullanıcıya anlaşılır mesaj gösterelim
      let errorMessage = 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.';
      
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Geçersiz e-posta adresi formatı.';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        // Güvenlik için "Kullanıcı bulunamadı" veya "Yanlış şifre" demek yerine genel bir hata vermek daha iyidir.
        errorMessage = 'E-posta veya şifre hatalı.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.';
      }

      Alert.alert('Giriş Başarısız', errorMessage);
    }

  };

  return (
    // KeyboardAvoidingView: Klavye açılınca ekranı yukarı iter
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <View style={styles.innerContainer}>
        
        {/* Başlık */}
        <Text style={styles.title}>UniTAG</Text>
        <Text style={styles.subtitle}>Öğrenci Girişi</Text>

        {/* E-posta Giriş Kutusu */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Öğrenci E-postası (...@edu.tr)"
            value={email}
            onChangeText={text => setEmail(text)} // Her harf girildiğinde state'i güncelle
            style={styles.input}
            keyboardType="email-address" // Klavye tipini e-posta yap
            autoCapitalize="none" // Otomatik büyük harfi kapat
          />
        </View>

        {/* Şifre Giriş Kutusu */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Şifre"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            secureTextEntry // Şifreyi gizle (**** şeklinde göster)
          />
        </View>

        {/* Giriş Yap Butonu */}
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>

        {/* Kayıt Ol Linki (Opsiyonel - İleride eklenebilir) */}
        <TouchableOpacity style={styles.registerLink}>
          <Text style={styles.registerText}>Hesabın yok mu? Kayıt Ol</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

// Stiller
const colors = {
  background: '#fefbf6', // Kırık Beyaz Arka Plan
  primary: '#00c49a',    // Canlı Yeşil (Ana Buton)
  accent: '#ff6b6b',     // Sıcak Mercan (Vurgu/Link)
  text: '#2c3e50',       // Koyu Lacivert (Metinler)
  white: '#ffffff',      // Saf Beyaz (Input Kutuları)
  shadow: '#000000',     // Siyah (Gölge için)
};

// Stiller
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Yeni arka plan rengi
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text, // Yeni metin rengi
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: colors.text, // Yeni metin rengi (biraz daha opak yapılabilir ama şimdilik aynı kalsın)
    marginBottom: 40,
    opacity: 0.8, // Alt başlığı biraz daha silik yapalım
  },
  inputContainer: {
    width: '100%',
    backgroundColor: colors.white, // Input arka planı saf beyaz
    borderRadius: 12, // Köşeleri biraz daha yuvarlattık (daha modern)
    marginBottom: 15,
    borderWidth: 1, // Hafif bir çerçeve ekledik
    borderColor: '#e0e0e0', // Çok açık gri çerçeve rengi
    // Gölge efektini biraz yumuşattık
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05, // Daha hafif gölge
    shadowRadius: 5,
    elevation: 3, // Android için gölge
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: colors.text, // Girilen yazı rengi
  },
  button: {
    width: '100%',
    backgroundColor: colors.primary, // Ana buton rengi (Canlı Yeşil)
    paddingVertical: 16, // Biraz daha yüksek buton
    borderRadius: 12, // Yuvarlak köşeler
    alignItems: 'center',
    marginTop: 10,
    // Butona da hafif bir gölge ekleyelim ki öne çıksın
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: colors.white, // Buton yazısı beyaz
    fontWeight: 'bold',
    fontSize: 18, // Yazıyı biraz büyüttük
  },
  registerLink: {
    marginTop: 25,
  },
  registerText: {
    color: colors.accent, // Link rengi (Sıcak Mercan)
    fontSize: 15,
    fontWeight: '600', // Biraz daha kalın
  },
});