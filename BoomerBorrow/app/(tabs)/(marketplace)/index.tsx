import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, TextInput, Button, StyleSheet, Text, ScrollView } from "react-native";
import axios from "axios";
import MapView from "./MapView"; // Automatically resolves to MapView.web.tsx or MapView.native.tsx

type Post = {
  type: string;
  data: {
    title: string;
    bio: string;
  };
};

export default function MarketplaceScreen() {
  const SERVER_URL = "http://localhost:3000";

  const [title, set_title] = useState("");
  const [bio, set_bio] = useState("");
  const [posts, set_posts] = useState<Post[]>([]);

  const post_data = {
    type: "new_post",
    data: { title, bio },
  };

  useEffect(() => {
    async function fetch_posts() {
      try {
        const response = await axios.get(`${SERVER_URL}/fetch_posts`);
        set_posts(response.data);
      } catch (error: any) {
        console.error("Failed to fetch posts:", error.message);
      }
    }
    fetch_posts();
  }, []);

  async function send_post() {
    try {
      await axios.post(`${SERVER_URL}/new_post`, post_data);
      console.log("Post sent to server");
      const response = await axios.get(`${SERVER_URL}/fetch_posts`);
      set_posts(response.data);
    } catch (error: any) {
      console.error("Sending post failed:", error.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView />
      </View>

      <View style={styles.postsContainer}>
        <ScrollView>
          {posts.map((post_data: Post, index: number) => (
            <View style={styles.post} key={index}>
              <Text>{post_data.data?.title}</Text>
              <Text>{post_data.data?.bio}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <TextInput style={styles.input} placeholder="Titel" value={title} onChangeText={set_title} />
      <TextInput style={styles.input} placeholder="Beskrivning" value={bio} onChangeText={set_bio} />
      <Button title="Skapa annons" onPress={send_post} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
    alignItems: "center",
  },
  mapContainer: {
    width: "90%",
    height: 200,
    margin: 12,
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    alignSelf: "center",
  },
  postsContainer: {
    width: "90%",
    height: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "white",
    alignSelf: "center",
  },
  post: {
    width: "95%",
    height: 80,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "white",
    alignSelf: "center",
  },
  input: {
    width: "90%",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "white",
    alignSelf: "center",
  },
});
