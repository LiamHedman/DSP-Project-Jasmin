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
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { get_user_id } from '@/auth_token';
import { log } from 'console';

type Message = {
  id: number,
  text: string;
  sender: string;
  chatId: string;
  createdAt: Timestamp;
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

  const [my_id, setId] = useState("");
  const [Name, SetName] = useState("");
  const [latest_chat, set_latest] = useState<number>(0);
  const socketRef = useRef<WebSocket | null>(null);

  //Listening in real-time to all messages in the Firestore 
  // chats/{chatId}/messages subcollection.
  useEffect(() => {
  const fetchUserId = async () => {
    //const storedId = await get_user_id();
    setId("me");
    /*if (storedId) {
      setId(storedId);
      console.log("actual id: " + storedId);
      console.log("actual id: " + my_id);
    }
      */
  };

  

  fetchUserId();

  if (!id) return;

  const q = query(
    collection(db, 'chats', id, 'messages'),
    where("id", ">=", latest_chat),
    orderBy('createdAt', 'asc')
  );

  const setup = async () => {
    const snapshot = await getDocs(q);
        const fetchedChats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Message),
        }));
  }
  

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const fetchedMessages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Message),
    }));

    console.log(fetchedMessages);
    const latest = fetchedMessages[fetchedMessages.length-1];
    set_latest(Number(latest.id));
    setMessages((prev) => {
    const currentMessages = prev[id] || [];

    // Create a Set of existing message IDs to prevent duplicates
    const existingIds = new Set(currentMessages.map((msg) => msg.id));

    // Filter only new messages that haven't been seen yet
    const newMessages = fetchedMessages.filter((msg) => !existingIds.has(msg.id));

    return {
      ...prev,
      [id]: [...currentMessages, ...newMessages],
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
      id: Date.now(),
      text: inputText,
      sender: my_id,
      chatId: id,
      createdAt: serverTimestamp() as Timestamp,
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
  
  

 const renderItem: ListRenderItem<Message> = ({ item }) => {
  const isUser = item.sender === 'me';
  console.log(isUser.toString());
  const timeString = item.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  console.log(timeString);


  return (
    <View style={[styles.messageContainer, isUser ? styles.userContainer : styles.botContainer]}>
      {isUser &&<Text style={styles.timeText}>{timeString}</Text>}

      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>

      {!isUser && <Text style={styles.timeText}>{timeString}</Text>}
    </View>
  );
};

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
        keyExtractor={(item) => item.id.toString()}
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
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  botContainer: {
    justifyContent: 'flex-start',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    marginHorizontal: 6,
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
