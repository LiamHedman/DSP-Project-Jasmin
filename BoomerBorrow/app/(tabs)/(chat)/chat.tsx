import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from './App';
import { useLocalSearchParams, useSearchParams } from 'expo-router/build/hooks';

import { db } from '../../firebaseConfig'; //Our private file with keys from firebase
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  FieldValue,
} from 'firebase/firestore';
import { get_user_id } from '@/auth_token';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  chatId: string;
  createdAt: FieldValue;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

type ChatParams = {
  id: string;
  name: string;
};

// Will run when the ChatScreen loads and whenever the id changes 
const ChatScreen: React.FC = () => {  
  // extract the chatId and name
  const { id, name } = useLocalSearchParams<{ id: string; name: string; }>();

  const [Id, setId] = useState("");
  const [Name, SetName] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  //Listening in real-time to all messages in the Firestore 
  // chats/{chatId}/messages subcollection.
  useEffect(() => {
  const fetchUserId = async () => {
    const storedId = await get_user_id();
    if (storedId) {
      SetName(storedId);
    }
  };

  fetchUserId();

  if (!id) return;

  const q = query(
    collection(db, 'chats', id, 'messages'),
    orderBy('createdAt', 'asc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const fetchedMessages = snapshot.docs.map((doc) => ({
      ...(doc.data() as Message),
    }));

    setMessages((prev) => {
      const currentMessages = prev[id] || [];
      const allMessagesMap = new Map<string, Message>();
      [...fetchedMessages, ...currentMessages].forEach((msg) => {
        allMessagesMap.set(msg.id, msg);
      });

      const mergedMessages = Array.from(allMessagesMap.values()).sort(
        (a, b) => (a.createdAt as any)?.seconds - (b.createdAt as any)?.seconds
      );

      return {
        ...prev,
        [id]: mergedMessages,
      };
    });
  });

  return () => {
    unsubscribe();
  };
}, [id]);
  

  const [messages, setMessages] = useState<Record<string, Message[]>>({
  });

  const [inputText, setInputText] = useState<string>('');


  const handleSend = async (): Promise<void> => {
    if (!inputText.trim()) return;
  
    //create a new message object
    const newMessage: Message = {
      id: Date.now.toString(),
      text: inputText,
      sender: 'user',
      chatId: id,
      createdAt: serverTimestamp(),
    };
  
    try {
      //send to Firestore in the current chat
      await addDoc(collection(db, 'chats', id, 'messages'), newMessage);
      setInputText('');
    } catch (error) {
      console.error('Error sending message: ', error);
    }
    //clears the input field
    setInputText('');
  };
  
  

  const renderItem: ListRenderItem<Message> = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={{flex: 0.1, height:20}}>
        <Text>{Name}</Text>
      </View>
      <FlatList
        data={messages[id]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          returnKeyType='send'
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  messagesContainer: {
    padding: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    maxWidth: '75%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6E6E6',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;