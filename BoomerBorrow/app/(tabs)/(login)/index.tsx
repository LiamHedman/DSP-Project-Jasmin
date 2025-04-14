import React, { createContext, useContext, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { getWebSocket } from '../connection';

/* let webSocket: WebSocket; */

export default function LoginScreen() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  
/*   useEffect(() => {
    webSocket = new WebSocket('ws://localhost:3000');

    webSocket.onopen = () => console.log('WebSocket connected');
    webSocket.onmessage = (e) => console.log('Message received:', e.data);
    webSocket.onerror = (e) => console.log('WebSocket error:', e);
    webSocket.onclose = (e) => console.log('WebSocket closed:', e.code, e.reason);

    setWs(webSocket); // Save WebSocket instance

    return () => webSocket.close(); // Cleanup on unmount
    
  }, []); // Empty dependency array ensures it runs once */


  useEffect(() => {
    console.log("USEEFFECT");
    const webSocket = getWebSocket(); // Get the shared WebSocket instance
    setWs(webSocket);

    return () => webSocket.close();
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Username:', username);
    console.log('Password:', password);
    router.push('../(marketplace)');
    const login = {"username" : username,
                   "password" : password
    };
    if(ws!==null)
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
      title="Log in" 
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