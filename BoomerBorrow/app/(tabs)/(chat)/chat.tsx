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
import { connectWebSocket, sendMessage, disconnectWebSocket } from '../../../connectionStuff/src/client_messages';

import { db } from '../../firebaseConfig'; //Our private file with keys from firebase
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  chatId: string;
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
    if (!id) return;
  
    //fetch the old messages and sort by creation date
    const q = query(
      collection(db, 'chats', id, 'messages'),
      orderBy('createdAt', 'asc')
    );
    
    //onSnapshot is firebase function which detects any real-time updates with query q
    const unsubscribe = onSnapshot(q, (snapshot) => {
      //transform Firestore documents (from query) into JavaScript objects
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Message),
      }));
  
      setMessages((prev) => ({
        ...prev,
        [id]: fetchedMessages,
      }));
    });
  
    //stops listener when done
    return () => unsubscribe();
  }, [id]);
  

  const [messages, setMessages] = useState<Record<string, Message[]>>({
<<<<<<< HEAD
    ["1"]: [
      { id: '1', text: 'Hello!', sender: 'bot', chatId: "1" },
      { id: '2', text: 'Hi there!', sender: 'user', chatId: "1" },
    ],
    ["2"]: [
      { id: '1', text: 'Hello!', sender: 'bot', chatId: "2" },
      { id: '2', text: 'Hi there!', sender: 'user', chatId: "2" },
    ],
    ["3"]: [
      { id: '1', text: 'Hello!', sender: 'bot', chatId: "3" },
      { id: '2', text: 'Hi there!', sender: 'user', chatId: "3" },
    ],
=======
   
>>>>>>> 37cc1679 (Sending and retrieving messagaes with firebase)
  });

  const [inputText, setInputText] = useState<string>('');


  const handleSend = async (): Promise<void> => {
    if (!inputText.trim()) return;
  
    //create a new message object
    const newMessage = {
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
        <Text>{name}</Text>
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