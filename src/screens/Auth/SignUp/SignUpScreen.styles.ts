import { Colors } from '@/src/constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingBottom: 40,
    paddingTop: 20,
  },
  // HEADER
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMedium,
    lineHeight: 24,
  },
  highlight: {
    color: Colors.primary,
    fontWeight: '700',
  },
  // FORM
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textDark,
    marginLeft: 4,
  },
  inputWrapper: {
    height: 64,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    fontSize: 17,
    color: Colors.textDark,
    fontWeight: '500',
    height: '100%',
  },
  // INFO BOX (Uyarı Kutusu)
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF', // Çok açık mavi
    padding: 16,
    borderRadius: 16,
    gap: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
    lineHeight: 20,
  },
  // BUTTON
  registerButton: {
    height: 64,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
  },
  footerText: {
    color: Colors.textMedium,
    fontSize: 15,
  },
  footerLink: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});