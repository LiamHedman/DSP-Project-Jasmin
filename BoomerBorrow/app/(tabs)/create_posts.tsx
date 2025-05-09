import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, TextInput, Button, StyleSheet, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { getWebSocket } from './connection';

/* WebSocket Server Message Handler Example:

ws.on('message', (message: string) => {
  try {
    const parsed_message = JSON.parse(message);
    if (parsed_message) {
      switch (parsed_message.type) {
        case "new_ad":
          const { title, bio, price, location } = parsed_message.data;
          console.log(`title: ${title}`);
          console.log(`bio: ${bio}`);
          console.log(`price: ${price}`);
          console.log(`location: ${location}`);

          // Forward the message to all connected clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(message);
            }
          });

          // Here you'd also save to a database (not shown)
          break;

        default:
          console.log("Unhandled message type");
      }
    } else {
      console.log("PARSED MESSAGE TYPE NOT SPECIFIED");
    }
  } catch {
    console.log("ERROR UPON RECEIVING DATA FROM USER");
  }
});
*/

type AD = {
  title: string;
  bio: string;
  price: string;
  location: string;
};

type incoming_ad = {
  type: string;
  data: AD;
};

export default function CreatePostsScreen() {
  const ws = getWebSocket();

  const [title, set_title] = useState('');
  const [bio, set_bio] = useState('');
  const [price, set_price] = useState('');
  const [location, set_location] = useState('');
  const [ads, set_ads] = useState<AD[]>([]);

  const login: incoming_ad = {
    type: "new_ad",
    data: {
      title,
      bio,
      price,
      location
    }
  };

  const add_ad = async (new_item: incoming_ad) => {
    const updated = [...ads, new_item.data];
    set_ads(updated);
  };

  const send_data = () => {
    set_title('');
    set_bio('');
    set_price('');
    set_location('');
    console.log("sending data");
    if (ws !== null) {
      ws.send(JSON.stringify(login));
    }
  };

  ws.onmessage = async (event) => {
    console.log('Message received:', event.data);
    try {
      const data: incoming_ad = JSON.parse(event.data);
      console.log(`Received JSON in client:`, data);
      add_ad(data);
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
        onChangeText={set_title}
      />
      <TextInput
        style={styles.input}
        placeholder="Beskrivning"
        value={bio}
        onChangeText={set_bio}
      />
      <TextInput
        style={styles.input}
        placeholder="Pris (kr/dag)"
        value={price}
        onChangeText={set_price}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Plats"
        value={location}
        onChangeText={set_location}
      />
      <Button
        title="Skapa annons"
        onPress={send_data}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green'
  },
  input: {
    height: 40,
    width: '80%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white'
  },
  post: {
    height: 80,
    width: '95%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    borderBlockColor: 'black'
  },
  posts_container: {
    height: 300,
    width: '90%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white'
  }
});
