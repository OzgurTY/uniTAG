import { Colors } from '@/src/constants/colors';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { IconSymbol } from './ui/icon-symbol';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  loading?: boolean;
}

export function RatingModal({ visible, onClose, onSubmit, loading = false }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, comment);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      {/* DÜZELTME: KeyboardAvoidingView ile sarmaladık */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Yolculuğun Nasıldı?</Text>
          <Text style={styles.subtitle}>Sürücüyü puanla ve deneyimini paylaş.</Text>

          {/* Yıldızlar */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <IconSymbol 
                  name={star <= rating ? "star.fill" : "star"} 
                  size={32} 
                  color={Colors.warning} 
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Yorum Alanı */}
          <TextInput
            style={styles.input}
            placeholder="Yorumun (Opsiyonel)"
            placeholderTextColor={Colors.textLight}
            multiline
            value={comment}
            onChangeText={setComment}
            // Klavyeyi kapatmak için "Bitti" butonu ekleyelim
            returnKeyType="done" 
            blurOnSubmit={true}
          />

          {/* Butonlar */}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={loading}>
              <Text style={styles.cancelText}>Vazgeç</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.submitButton, rating === 0 && styles.disabledButton]} 
              onPress={handleSubmit}
              disabled={rating === 0 || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitText}>Gönder</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    // Gölge ekleyerek pop-up hissini güçlendirelim
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMedium,
    textAlign: 'center',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
    fontSize: 16,
    color: Colors.textDark,
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.textMedium,
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  disabledButton: {
    backgroundColor: Colors.textLight,
  },
  submitText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});