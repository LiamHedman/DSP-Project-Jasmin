import React, { useEffect, useReducer, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { get_user_id } from '@/auth_token';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  FieldValue,
} from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';

type Chat = {
  id: string;
  name: string;
};

const mockChats: Chat[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
];

type ChatListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatList'>;

const ChatListScreen: React.FC = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [my_id, set_id] = useState<string>("");
  const { owner_id } = useLocalSearchParams<{ owner_id: string;}>();

  useEffect(() => {
    const q = query(
          collection(db, 'chats'),
          orderBy('asc')
        );

    const setupChat = async () => {
      const my_id = await get_user_id(); // Make sure to await
      console.log("my_id:", my_id);
      console.log("owner_id:", owner_id);

      if (!chats.some(chat => chat.name === owner_id)) {
        const newChat: Chat = { id: my_id + "_" + owner_id, name: owner_id };
        console.log("Creating chat with id:", newChat.id);
        //setChats((prev) => [...prev, newChat]);
      }
    };

    const unsubscribe = onSnapshot(q, (snapshot) => {
          //transform Firestore documents (from query) into JavaScript objects
          const fetchedMessages = snapshot.docs.map((doc) => ({
            ...(doc.data() as Chat),
          }));
      
          
          setChats((prev) => (
           fetchedMessages
          ));
        });

    setupChat();
    return () => unsubscribe();
}, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            //onPress={() => navigation.navigate('Chat')}
            onPress={() => {
              /*
              router.setParams({
                name: item.name,
                id: item.id
              })
                */
              
              router.push({
                pathname: '/chat',
                params: {
                  id: item.id,
                  name: item.name,
                },
              });
              //router.push('./chat');
            }}
            //onPress={() => router.push('/chat')}
          >
            <Text style={styles.chatName}>{item.id}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  chatName: {
    fontSize: 18,
  },
});

export default ChatListScreen;