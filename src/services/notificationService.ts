import {
    addDoc, collection,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
    writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Notification } from '../types/notification';

export const NotificationService = {
  // 1. Bildirim Gönder
  sendNotification: async (
    userId: string, 
    title: string, 
    message: string, 
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    relatedRideId?: string
  ) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId,
        title,
        message,
        type,
        read: false,
        createdAt: new Date().toISOString(),
        relatedRideId
      });
      return { success: true };
    } catch (error) {
      console.error("Bildirim gönderme hatası:", error);
      return { success: false, error };
    }
  },

  // 2. Bildirimleri Dinle (Real-time)
  subscribeToNotifications: (userId: string, onUpdate: (notifications: Notification[]) => void) => {
    const ref = collection(db, 'notifications');
    // Bana ait bildirimler, tarihe göre sıralı (en yeni en üstte)
    const q = query(
      ref, 
      where('userId', '==', userId), 
      orderBy('createdAt', 'desc')
    );

    // onSnapshot ile anlık dinleme başlatıyoruz
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Notification));
      onUpdate(data);
    });

    return unsubscribe;
  },

  // 3. Bildirimi Okundu İşaretle
  markAsRead: async (notificationId: string) => {
    try {
      const ref = doc(db, 'notifications', notificationId);
      await updateDoc(ref, { read: true });
    } catch (error) {
      console.error("Okundu işaretleme hatası:", error);
    }
  },

  // 4. Tümünü Okundu Yap
  markAllAsRead: async (userId: string) => {
    try {
      const q = query(
        collection(db, 'notifications'), 
        where('userId', '==', userId), 
        where('read', '==', false)
      );
      const snapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { read: true });
      });
      
      await batch.commit();
    } catch (error) {
      console.error("Toplu okuma hatası:", error);
    }
  }
};