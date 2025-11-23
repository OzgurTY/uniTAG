import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    orderBy,
    query,
    updateDoc,
    where
} from 'firebase/firestore';
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
  },

  getRideById: async (rideId: string) => {
    try {
      const docRef = doc(db, 'rides', rideId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } as Ride };
      } else {
        return { success: false, error: 'İlan bulunamadı' };
      }
    } catch (error) {
      console.error("İlan detayı çekme hatası:", error);
      return { success: false, error };
    }
  },

  joinRide: async (rideId: string, userId: string) => {
    try {
      const rideRef = doc(db, 'rides', rideId);
      
      // Önce ilanın güncel durumunu kontrol et (Koltuk kaldı mı?)
      const rideSnap = await getDoc(rideRef);
      if (!rideSnap.exists()) return { success: false, error: 'İlan bulunamadı' };
      
      const rideData = rideSnap.data() as Ride;
      
      if (rideData.availableSeats <= 0) {
        return { success: false, error: 'Maalesef koltuk kalmadı.' };
      }
      
      if (rideData.passengers.includes(userId)) {
        return { success: false, error: 'Zaten bu yolculuğa katıldınız.' };
      }

      // Güncelleme işlemi (Atomik işlem)
      await updateDoc(rideRef, {
        passengers: arrayUnion(userId), // Kullanıcıyı listeye ekle
        availableSeats: increment(-1),  // Koltuk sayısını 1 düşür
      });

      // Eğer koltuk kalmadıysa statüsü 'full' yap (Opsiyonel kontrol)
      if (rideData.availableSeats - 1 === 0) {
        await updateDoc(rideRef, { status: 'full' });
      }

      return { success: true };
    } catch (error) {
      console.error("Yolculuğa katılma hatası:", error);
      return { success: false, error };
    }
  },

  getDriverRides: async (userId: string) => {
    try {
      const ridesRef = collection(db, 'rides');
      // driverId benim ID'm olanlar
      const q = query(
        ridesRef, 
        where('driverId', '==', userId), 
        orderBy('departureTime', 'desc') // En yeni en üstte
      );
      
      const snapshot = await getDocs(q);
      const rides = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ride));
      
      return { success: true, data: rides };
    } catch (error) {
      console.error("Sürücü ilanları çekme hatası:", error);
      return { success: false, error };
    }
  },

  getPassengerRides: async (userId: string) => {
    try {
      const ridesRef = collection(db, 'rides');
      // passengers listesinde benim ID'm olanlar
      const q = query(
        ridesRef, 
        where('passengers', 'array-contains', userId),
        orderBy('departureTime', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const rides = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ride));
      
      return { success: true, data: rides };
    } catch (error) {
      console.error("Yolcu ilanları çekme hatası:", error);
      return { success: false, error };
    }
  },

  updateRideStatus: async (rideId: string, status: 'completed' | 'cancelled') => {
    try {
      const rideRef = doc(db, 'rides', rideId);
      await updateDoc(rideRef, { status });

      // EĞER YOLCULUK TAMAMLANDIYSA: Sürücünün yolculuk sayısını 1 artır
      if (status === 'completed') {
        // 1. İlanın detayını çek (Sürücü ID'sini bulmak için)
        const rideSnap = await getDoc(rideRef);
        if (rideSnap.exists()) {
          const rideData = rideSnap.data() as Ride;
          
          // 2. Sürücünün profiline git ve sayıyı artır
          const driverRef = doc(db, 'users', rideData.driverId);
          await updateDoc(driverRef, {
            rideCount: increment(1)
          });
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Durum güncelleme hatası:", error);
      return { success: false, error };
    }
  },

  leaveRide: async (rideId: string, userId: string) => {
    try {
      const rideRef = doc(db, 'rides', rideId);
      
      // Güncelleme işlemi
      await updateDoc(rideRef, {
        passengers: arrayRemove(userId), // Kullanıcıyı listeden sil
        availableSeats: increment(1),    // Koltuk sayısını 1 artır
        status: 'active'                 // Eğer 'full' ise tekrar 'active' olsun
      });

      return { success: true };
    } catch (error) {
      console.error("Yolculuktan ayrılma hatası:", error);
      return { success: false, error };
    }
  },
};