import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatListScreen from './ChatListScreen';
import ChatScreen from './chat';

export type RootStackParamList = {
  ChatList: undefined;
  Chat: { chatId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Chats' }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;