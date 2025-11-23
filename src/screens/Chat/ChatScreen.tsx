import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/src/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { ChatService } from '@/src/services/chatService';
import { UserService } from '@/src/services/userService';
import { Message } from '@/src/types/chat';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList, KeyboardAvoidingView, Platform,
    SafeAreaView,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import { styles } from './ChatScreen.styles';

export default function ChatScreen() {
  const { id: rideId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [userName, setUserName] = useState('');
  
  const flatListRef = useRef<FlatList>(null);

  // Kullanıcı ismini çek (Mesajda göstermek için)
  useEffect(() => {
    if (user) {
      UserService.getUserProfile(user.uid).then(res => {
        if (res.success && res.data) {
          setUserName(res.data.fullName);
        }
      });
    }
  }, [user]);

  // Mesajları Dinle
  useEffect(() => {
    if (!rideId) return;

    const unsubscribe = ChatService.subscribeToMessages(rideId, (newMessages) => {
      setMessages(newMessages);
    });

    return () => unsubscribe(); // Sayfadan çıkınca dinlemeyi bırak
  }, [rideId]);

  const handleSend = async () => {
    if (!inputText.trim() || !user || !rideId) return;

    const text = inputText.trim();
    setInputText(''); // Inputu temizle

    await ChatService.sendMessage(rideId, user.uid, userName, text);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === user?.uid;
    const time = new Date(item.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.otherMessageRow]}>
        {!isMe && <Text style={styles.senderName}>{item.senderName}</Text>}
        
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
          <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
            {item.text}
          </Text>
          <Text style={[styles.timeText, isMe ? styles.myTimeText : styles.otherTimeText]}>
            {time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={24} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yolculuk Sohbeti</Text>
      </View>

      {/* MESAJ LİSTESİ */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        inverted // En yeni mesaj en altta görünsün diye listeyi ters çeviriyoruz
        keyboardShouldPersistTaps="handled"
      />

      {/* INPUT ALANI */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Mesaj yaz..."
              placeholderTextColor={Colors.textMedium}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
          </View>
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <IconSymbol name="paperplane.fill" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}