import React, { useReducer } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

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
  const router = useRouter()

  return (
    <View style={styles.container}>
      <FlatList
        data={mockChats}
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

              console.log(item.id);
              console.log(item.name);
              
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
            <Text style={styles.chatName}>{item.name}</Text>
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