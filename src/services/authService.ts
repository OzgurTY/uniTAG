import {
    AuthError,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Hata mesajlarını Türkçeleştirmek için yardımcı fonksiyon
const getErrorMessage = (error: AuthError) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Bu e-posta adresi zaten kullanımda.';
    case 'auth/invalid-email':
      return 'Geçersiz e-posta adresi.';
    case 'auth/user-not-found':
      return 'Kullanıcı bulunamadı.';
    case 'auth/wrong-password':
      return 'Hatalı şifre.';
    case 'auth/weak-password':
      return 'Şifre çok zayıf (en az 6 karakter olmalı).';
    default:
      return error.message;
  }
};

export const AuthService = {
  // Kayıt Ol
  signUp: async (email: string, password: string, fullName: string) => {
    try {
      // 1. Kullanıcıyı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Profil ismini güncelle
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: fullName
        });
      }
      
      return { user: userCredential.user, error: null };
    } catch (e) {
      const error = e as AuthError;
      return { user: null, error: getErrorMessage(error) };
    }
  },

  // Giriş Yap
  signIn: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (e) {
      const error = e as AuthError;
      return { user: null, error: getErrorMessage(error) };
    }
  },

  // Çıkış Yap
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Çıkış hatası:", error);
    }
  }
};