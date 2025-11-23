import { Colors } from '@/src/constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMedium,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    marginLeft: 4,
  },
  inputWrapper: {
    height: 56,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    fontSize: 16,
    color: Colors.textDark,
    height: '100%',
  },
  disabledInput: {
    opacity: 0.5,
  },
  deleteButton: {
    marginTop: 40,
    marginBottom: 60,
    backgroundColor: '#FEF2F2',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteButtonText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '700',
  },
});