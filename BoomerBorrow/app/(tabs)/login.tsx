import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';


export default function LoginScreen() {
var ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  // connection opened
  ws.send('something'); // send a message
};

ws.onmessage = (e) => {
  // a message was received
  console.log(e.data);
};

ws.onerror = (e) => {
  // an error occurred
  //console.log(e.message);
};

ws.onclose = (e) => {
  // connection closed
  console.log(e.code, e.reason);
};

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Username:', username);
    console.log('Password:', password);
    router.push('/');
    const login = {"username" : username,
                   "password" : password
    };
    ws.send(JSON.stringify(login));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername} // Updates state
      />

      <TextInput
        style={styles.input}
        placeholder="Enter password"
        value={password}
        secureTextEntry
        onChangeText={setPassword} // Updates state
      />
      <Button 
      title="Log In" 
      onPress={handleLogin
        
      } />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});