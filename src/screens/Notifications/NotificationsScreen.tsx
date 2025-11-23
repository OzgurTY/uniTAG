import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/src/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { NotificationService } from '@/src/services/notificationService';
import { Notification } from '@/src/types/notification';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './NotificationsScreen.styles';

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Bildirimleri Dinle
  useEffect(() => {
    if (!user) return;

    const unsubscribe = NotificationService.subscribeToNotifications(user.uid, (data) => {
      setNotifications(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handlePress = async (notification: Notification) => {
    // 1. Okundu işaretle (eğer okunmamışsa)
    if (!notification.read) {
      await NotificationService.markAsRead(notification.id);
    }

    // 2. İlgili ilana git (varsa)
    if (notification.relatedRideId) {
      router.push(`/ride/${notification.relatedRideId}`);
    }
  };

  const handleReadAll = () => {
    if (user) {
      NotificationService.markAllAsRead(user.uid);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return { name: 'checkmark.circle.fill', color: Colors.success };
      case 'warning': return { name: 'exclamationmark.triangle.fill', color: Colors.warning };
      case 'error': return { name: 'xmark.circle.fill', color: Colors.error };
      default: return { name: 'bell.fill', color: Colors.primary };
    }
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const iconData = getIcon(item.type);
    const time = new Date(item.createdAt).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    return (
      <TouchableOpacity 
        style={[styles.card, !item.read && styles.unreadCard]} 
        onPress={() => handlePress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: iconData.color + '20' }]}>
          <IconSymbol name={iconData.name as any} size={20} color={iconData.color} />
        </View>
        
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <IconSymbol name="arrow.left" size={24} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bildirimler</Text>
        <TouchableOpacity onPress={handleReadAll}>
          <Text style={styles.readAllText}>Tümünü Oku</Text>
        </TouchableOpacity>
      </View>

      {/* LISTE */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <IconSymbol name="bell.slash.fill" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>Henüz bir bildirim yok.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}