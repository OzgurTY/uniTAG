import { Colors } from '@/src/constants/colors';
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between', // İçeriği en üst ve en alt olarak ayırır
    paddingBottom: 20, // Alt kısımdan güvenli boşluk
  },
  topSection: {
    marginTop: 60,
    alignItems: 'center',
  },
  // Logo Tasarımı (Text Bazlı)
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  logoTextUni: {
    fontSize: 48,
    fontWeight: '300', // İnce font
    color: Colors.textDark,
    letterSpacing: -1,
  },
  logoTextTag: {
    fontSize: 48,
    fontWeight: '900', // Kalın font
    color: Colors.primary, // Mavi renk vurgusu
    letterSpacing: -1,
  },
  // Hero Metinleri
  tagline: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: 36,
    marginTop: 24,
  },
  description: {
    fontSize: 17,
    color: Colors.textMedium,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 16,
    paddingHorizontal: 10,
  },
  // İllüstrasyon veya Görsel Alanı (Opsiyonel placeholder)
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  illustrationCircle: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: Colors.surface,
    borderRadius: width, // Tam daire
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  // Aksiyon Butonları
  bottomSection: {
    gap: 16,
    marginBottom: 20,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 100, // Hap şekli (Pill shape)
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonPrimaryText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
  buttonSecondary: {
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  buttonSecondaryText: {
    color: Colors.textDark,
    fontSize: 17,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 12,
  },
});