import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { getWebSocket } from './connection';

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

type AD = {
    title: string;
    bio: string;
};
type incoming_ad = {
    type: string;
    data: AD;
};

export default function MarketplaceScreen() {
    const ws = getWebSocket();

    const [title, set_title] = useState('');
    const [bio, set_bio] = useState('');
    const [ads, set_ads] = useState<AD[]>([]);

    const login = {
        "type": "new_ad",
        "data": {
            "title": title,
            "bio": bio
        }
    };

    const add_ad = async (new_item: incoming_ad) => {
        const updated = [...ads, new_item.data];
        set_ads(updated);
    }

    const send_data = () => {
        console.log("sending data");
        if (ws !== null)
            ws.send(JSON.stringify(login));
    }

    ws.onmessage = async (event) => {
        console.log('Message received:', event.data);
        try {
            console.log(`Received JSON in client: ${event.data}`)
            //const text = await event.data.text();
            const data: incoming_ad = JSON.parse(event.data);
            console.log(data);

            add_ad(data);
            //set_title(data.data.title);

        } catch {
            console.error('Failed to handle message in client:');    
        }
    };    
    
    
    return (
        
        <SafeAreaView style={styles.container}>
            <View style={styles.posts_container}>
                {ads.map((ad: AD) => {
                    return (
                        <View style={styles.post}>
                            <Text style={styles.input}> {ad.title} HEJ {ad.bio} </Text>
                        </View>
                    );
                })}
            </View>
    
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
        height: 40,
        width: '80%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'white',
        borderBlockColor: 'black'
    },
    posts_container: {
        height: 200,
        width: '80%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'white'
    }
});