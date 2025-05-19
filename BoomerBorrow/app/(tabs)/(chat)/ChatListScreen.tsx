import React, { useEffect, useReducer, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { get_user_id, get_user_name } from '@/auth_token';
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
} from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { log } from 'console';

type Chat = {
  id: string;
  participants: string[];
  names: string[];
};


type ChatListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatList'>;


const ChatListScreen: React.FC = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [id, set_id] = useState<string>("");
  const [name, set_name] = useState<string>("");
  const { owner_id, owner_name } = useLocalSearchParams<{ owner_id: string; owner_name: string}>();

  const fetch_user_id = async () => {
    const my_id = await get_user_id() as string;
    set_id(my_id);
    console.log("actual id: " + id);
    //set_id("me");
    //console.log("for testing: " + id);    
  }
  const fetch_user_name = async () => {
    const my_name = await get_user_name() as string;
    set_name(my_name);
    console.log("actual name: " + name);
    //set_id("me");
    //console.log("for testing: " + id);    
  }

  const getChatName = (chat: Chat) => {
    if(chat.names[0] != name)
      return chat.names[0];
    else
      return chat.names[1];
  }
  

  useEffect(() => {
    console.log("AAAAAAAAAAAAa");
    console.log("owner_id: " + owner_id);

    console.log("HEJ");
    fetch_user_id();
    fetch_user_name();
  }, []);

  useEffect(() => {
    console.log("SSSSSSSSSSSSS");
  if (!id) return; // Skip if id hasn't loaded yet

  const q = query(
    collection(db, 'chats'),
    where("participants", "array-contains", id),
  );

  const setupChat = async () => {
    const snapshot = await getDocs(q);
    
    const fetchedChats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Chat, 'id'>),
    }));

    setChats(fetchedChats);

    console.log("AAAAAAAAAAAAAAAAA");

    if(owner_id)
      console.log("owner id works: " + owner_id);

    if(fetchedChats.some(chat => chat.participants.includes(owner_id)))
      console.log("has id");
    

    console.log(name);
    console.log(owner_name);

    if (owner_id && !fetchedChats.some(chat => chat.participants.includes(owner_id))) {
      const newChatRef = await addDoc(collection(db, 'chats'), {
        id: id + "_" + owner_id,
        participants: [id, owner_id],
        names: [name, owner_name],
      });
      console.log("Created new chat with id:", newChatRef.id);
    }
  };

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const fetchedChats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Chat, 'id'>),
    }));

    setChats(fetchedChats);
  });
  setupChat();

  return () => unsubscribe();
}, [id]);

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
                  name: getChatName(item),
                },
              });
              //router.push('./chat');
            }}
            //onPress={() => router.push('/chat')}
          >
            <Text style={styles.chatName}>{getChatName(item)}</Text>
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