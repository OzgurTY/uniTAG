// src/services/userService.ts

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile } from '../types/user';

export const UserService = {
  // Yeni kullanıcı profilini veritabanına kaydet
  createUserProfile: async (user: UserProfile) => {
    try {
      // 'users' koleksiyonunda, kullanıcının UID'si ile bir doküman oluşturuyoruz
      await setDoc(doc(db, 'users', user.uid), user);
      return { success: true };
    } catch (error) {
      console.error("Profil oluşturma hatası:", error);
      return { success: false, error };
    }
  },

  // Kullanıcı profilini veritabanından çek
  getUserProfile: async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { data: docSnap.data() as UserProfile, success: true };
      } else {
        console.log("Böyle bir kullanıcı profili yok!");
        return { data: null, success: false, error: 'Profil bulunamadı' };
      }
    } catch (error) {
      console.error("Profil çekme hatası:", error);
      return { data: null, success: false, error };
    }
  }
};