import {
    addDoc, collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Message } from '../types/chat';

export const ChatService = {
  sendMessage: async (rideId: string, senderId: string, senderName: string, text: string) => {
    try {
      const messagesRef = collection(db, 'rides', rideId, 'messages');
      
      await addDoc(messagesRef, {
        senderId,
        senderName,
        text,
        createdAt: new Date().toISOString(),
        serverTime: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error("Mesaj gönderme hatası:", error);
      return { success: false, error };
    }
  },

  // Mesajları Dinle (Real-time)
  subscribeToMessages: (rideId: string, onUpdate: (messages: Message[]) => void) => {
    const messagesRef = collection(db, 'rides', rideId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      
      onUpdate(messages);
    });

    return unsubscribe;
  }
};