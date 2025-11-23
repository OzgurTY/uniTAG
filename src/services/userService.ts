import {
    collection,
    doc,
    getDoc,
    increment,
    runTransaction,
    setDoc,
    updateDoc
} from 'firebase/firestore';
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
  },

  registerDriver: async (uid: string, driverData: { carModel: string; carColor: string; plateNumber: string }) => {
    try {
      const userRef = doc(db, 'users', uid);
      
      // Mevcut kullanıcı dokümanını güncelliyoruz (Merge işlemi)
      await updateDoc(userRef, {
        role: 'driver', // Rolü sürücü yapıyoruz
        driverDetails: {
          ...driverData,
          verified: true // Şimdilik otomatik onaylı, ileride admin onayı eklenebilir
        }
      });
      
      return { success: true };
    } catch (error) {
      console.error("Sürücü kayıt hatası:", error);
      return { success: false, error };
    }
  },

  rateDriver: async (driverId: string, raterId: string, rating: number, comment: string) => {
    try {
      const driverRef = doc(db, 'users', driverId);
      
      // Transaction kullanarak güvenli bir şekilde ortalamayı güncelliyoruz
      await runTransaction(db, async (transaction) => {
        const driverDoc = await transaction.get(driverRef);
        if (!driverDoc.exists()) throw "Sürücü bulunamadı!";

        const data = driverDoc.data();
        const currentRating = data.rating || 0;
        const currentCount = data.reviewCount || 0;

        // Yeni ortalamayı hesapla
        // Formül: ((Eski Ortalama * Sayı) + Yeni Puan) / (Sayı + 1)
        const newRating = ((currentRating * currentCount) + rating) / (currentCount + 1);

        // 1. Sürücü dokümanını güncelle
        transaction.update(driverRef, {
          rating: newRating,
          reviewCount: increment(1)
        });

        // 2. Yorumu alt koleksiyona ekle (users/DRIVER_ID/reviews/REVIEW_ID)
        const reviewRef = doc(collection(db, 'users', driverId, 'reviews'));
        transaction.set(reviewRef, {
          raterId,
          rating,
          comment,
          createdAt: new Date().toISOString()
        });
      });

      return { success: true };
    } catch (error) {
      console.error("Puanlama hatası:", error);
      return { success: false, error };
    }
  }
};
