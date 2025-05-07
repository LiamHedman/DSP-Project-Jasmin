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

const ChatScreen: React.FC = () => {  
  //const { id, name } = useLocalSearchParams<ChatParams>();
  const { id, name } = useLocalSearchParams<{ id: string; name: string; }>();

  const [Id, setId] = useState("");
  const [Name, SetName] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!id) return;
  
    connectWebSocket({
      chatId: id, // <-- Use the actual chatId from params
      onMessage: (message) => {
        setMessages((prev) => ({
          ...prev,
          [id]: [...(prev[id] || []), message],
        }));
      },
    });
  
    return () => {
      disconnectWebSocket();
    };
  }, [id]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    [id]: [
      { id: '1', text: 'Hello!', sender: 'bot', chatId: id },
      { id: '2', text: 'Hi there!', sender: 'user', chatId: id },
    ],
  });

  const [inputText, setInputText] = useState<string>('');

  const handleSend = (): void => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      chatId: id
    };

    sendMessage(newMessage);
    setMessages((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), newMessage],
    }));
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
      <View style={{flex: 1}}>
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