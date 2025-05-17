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
  where,
} from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';

type Chat = {
  id: string;
  participants: string[2];
};


type ChatListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatList'>;


const ChatListScreen: React.FC = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [my_id, set_id] = useState<string>("");
  const { owner_id } = useLocalSearchParams<{ owner_id: string;}>();

  const fetch_user_id = async () => {
    const my_id = await get_user_id() as string;
    set_id(my_id);
    console.log("actual id: " + my_id);
    set_id("me");
    console.log("for testing: " + my_id);    
  }
  
  useEffect(() => {
    
    fetch_user_id();

    const q = query(
          collection(db, 'chats'),
          where("participants", "array-contains", my_id),
        );

    const setupChat = async () => {
      const my_id = await get_user_id(); // Make sure to await
      console.log("my_id:", my_id);
      console.log("owner_id:", owner_id);



      /*
      if (!chats.some(chat => chat.name === owner_id)) {
        const newChat: Chat = { id: my_id + "_" + owner_id, name: owner_id };
        console.log("Creating chat with id:", newChat.id);
        setChats((prev) => [...prev, newChat]);
      }
        */
    };

    const unsubscribe = onSnapshot(q, (snapshot) => {
          //transform Firestore documents (from query) into JavaScript objects
          const fetchedMessages = snapshot.docs.map((doc) => ({
            ...(doc.data() as Chat),
          }));
      
          console.log(fetchedMessages);
          
          setChats(
           fetchedMessages
          );
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
                  name: item.participants[0],
                },
              });
              //router.push('./chat');
            }}
            //onPress={() => router.push('/chat')}
          >
            <Text style={styles.chatName}>{item.participants[0]}</Text>
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