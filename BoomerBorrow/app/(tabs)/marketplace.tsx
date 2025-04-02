import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { getWebSocket } from './connection';

const ws = getWebSocket();


/* ws.on('message', (message: string) => {

  try {
    const parsed_message = JSON.parse(message);
    if(parsed_message) {
      switch (parsed_message.type) {
        case "new_ad":
          console.log(`title: ${parsed_message.data.title}`);
          console.log(`bio: ${parsed_message.data.bio}`);

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(message);
            }
          });
      }
    } else {
      console.log("PARSED MESSAGE TYPE NOT SPECIFIED");
    }
  } catch {
    console.log("ERROR UPON RECEIVING DATA FROM USER");      
  }
}); */

export default function MarketplaceScreen(){
  
  const [title, set_title] = useState('');
  const [bio, set_bio] = useState('');
  
  const login = {
    "type": "new_ad",
    "data": {
      "title": title,
      "bio": bio
    }
  };
  
  const send_data = () => {
    console.log("sending data");
    if(ws!==null)
      ws.send(JSON.stringify(login));
  }

  ws.onmessage = async (event) => {
    console.log('Message received:', event.data);
    try {
      console.log(`Received JSON in client: ${event.data}`)
      const text = await event.data.text();
      const data = JSON.parse(text);
      set_title(data.data.title);

    } catch {
      console.error('Failed to handle message in client:');
    }
  };
  
    
    return (    

    <SafeAreaView style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Titel"
            value={title}
            onChangeText={set_title} // Updates state
          />
    
          <TextInput
            style={styles.input}
            placeholder="Beskrivning"
            value={bio}
            onChangeText={set_bio} // Updates state
          />
          <Button 
          title="Skapa annons" 
          onPress={send_data
            
          } />
        </SafeAreaView>
        
        

    )
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