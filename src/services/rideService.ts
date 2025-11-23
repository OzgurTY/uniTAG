import { addDoc, collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Ride } from '../types/ride';

export const RideService = {
  createRide: async (rideData: Omit<Ride, 'id'>) => {
    try {
      // 'rides' koleksiyonuna yeni bir ilan ekle
      const docRef = await addDoc(collection(db, 'rides'), rideData);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("İlan oluşturma hatası:", error);
      return { success: false, error };
    }
  },

  getAvailableRides: async () => {
    try {
      const ridesRef = collection(db, 'rides');
      // Sadece 'active' statüsündeki ilanları, oluşturulma tarihine göre (yeniden eskiye) getir
      const q = query(ridesRef, where('status', '==', 'active'), orderBy('createdAt', 'desc'));
      
      const snapshot = await getDocs(q);
      const rides = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ride));
      
      return { success: true, data: rides };
    } catch (error) {
      console.error("İlanları çekme hatası:", error);
      return { success: false, error };
    }
  }
};