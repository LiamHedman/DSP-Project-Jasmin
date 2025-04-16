import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, TextInput, Button, StyleSheet, Text, ScrollView } from "react-native";
import axios from "axios";
import Mapbox, { MapView, Camera } from "@rnmapbox/maps";

// Set the Mapbox access token
Mapbox.setAccessToken("pk.eyJ1Ijoicm9zbzQ3ODUiLCJhIjoiY205Z3Q4azlpMXN6cTJrcXc3anNhN2d2eCJ9.gYQgEn_h2O1CGIxWkEpcdA");

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
    data: {
      title: title,
      bio: bio,
    },
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
      console.log("post_data (the new post) sent to the server");

      const response = await axios.get(`${SERVER_URL}/fetch_posts`);
      set_posts(response.data);
    } catch (error: any) {
      console.error("new_post failed:", error.message);
    }
  }

  const handle_new_post = async () => {
    await send_post();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView style={styles.map}>
          <Camera
            zoomLevel={14}
            centerCoordinate={[18.063240, 59.334591]} // Longitude, Latitude
          />
        </MapView>
      </View>

      {/* Posts List */}
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

      {/* Input Fields and Button */}
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
      <Button title="Skapa annons" onPress={handle_new_post} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
    alignItems: "center", // Center children horizontally
  },
  mapContainer: {
    width: "90%",
    height: 200,
    margin: 12,
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    alignSelf: "center", // Ensure map is centered
  },
  map: {
    flex: 1,
  },
  postsContainer: {
    width: "90%", // Match other components
    height: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "white",
    alignSelf: "center", // Ensure posts are centered
  },
  post: {
    width: "95%", // Relative to postsContainer
    height: 80,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "white",
    borderBlockColor: "black",
    alignSelf: "center", // Center individual posts
  },
  input: {
    width: "90%", // Match other components
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "white",
    alignSelf: "center", // Ensure inputs are centered
  },
});
