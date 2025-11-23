import { Colors } from '@/src/constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
  },
  content: {
    padding: 24,
    paddingBottom: 120, // Buton için boşluk
  },
  // Fiyat ve Rota Kartı
  mainCard: {
    backgroundColor: Colors.surface,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  price: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
  },
  perPerson: {
    fontSize: 14,
    color: Colors.textMedium,
    marginBottom: 20,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  locationContainer: {
    flex: 1,
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    textAlign: 'center',
  },
  arrowIcon: {
    marginHorizontal: 10,
  },
  // Bilgi Satırları
  infoSection: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
  },
  // Alt Buton Alanı
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  driverActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // veya 'center' ile gap verebiliriz
    gap: 16,
  },
  iconButton: {
    flex: 1, // Eşit genişlik
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  
  // Eski joinButton stillerini YOLCU için koruyabilirsin
  joinButton: {
    backgroundColor: Colors.primary,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  joinButtonDisabled: {
    backgroundColor: Colors.textLight,
    shadowOpacity: 0,
  },
  joinButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});