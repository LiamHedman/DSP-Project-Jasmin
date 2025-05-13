import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, TextInput, Button, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import axios from "axios";
// import MapView from './MapView'; // Import from same directory
import Mapbox, { MapView, Camera } from "@rnmapbox/maps";

// Set the Mapbox access token
Mapbox.setAccessToken("pk.eyJ1Ijoicm9zbzQ3ODUiLCJhIjoiY205Z3Q4azlpMXN6cTJrcXc3anNhN2d2eCJ9.gYQgEn_h2O1CGIxWkEpcdA");
import { Supply_post } from "./../../../classes_tmp";
import { get_user_id } from "@/auth_token";
//import token_storage from "@/token_storage";

export default function MarketplaceScreen() {
  const SERVER_URL = "http://localhost:3000";
  let supply_post: Supply_post;

  const [title, set_title] = useState("");
  const [description, set_description] = useState("");
  const [price, set_price] = useState("");
  const [category, set_category] = useState("");
  const [location, set_location] = useState("");
  const [post_picture_url, set_post_picture_url] = useState("");

  // All the supply posts gets stored here
  const [posts, set_posts] = useState<Supply_post[]>([]);

  async function fetch_active_supply_posts() {
    try {
      const response = await axios.get(`${SERVER_URL}/fetch_all_supply_posts`);
      set_posts(response.data);
    } catch (error: any) {
      console.error("Failed to fetch active_supply_posts:", error.message);
    }
  }

  // Runs on page mount
  useEffect(() => {
    fetch_active_supply_posts();
  }, []);

  async function send_supply_post() {
    try {

      const created_at = new Date().toISOString();
	
	  // TODO: need unique ID:s for every post
      const owner_id = await get_user_id();
      if (owner_id === null ) { throw new Error("Owner id cannot be null upon post creation"); }
      supply_post = new Supply_post(owner_id, title, description, price, category, location, post_picture_url, created_at);
      
      await axios.post(`${SERVER_URL}/new_supply_post`, supply_post, { headers: { auth: `${await get_user_id()}` } });
      console.log("post_data (the new post) sent to the server");

      const response = await axios.get(`${SERVER_URL}/fetch_all_supply_posts`);
      set_posts(response.data);
    } catch (error: any) {
      console.error("new_supply_post failed:", error.message);
    }
  }

  const handle_new_supply_post = async () => {
    await send_supply_post();
  };

  async function reset_table_content() {
    try {
      set_posts([]);
      await axios.post(`${SERVER_URL}/reset_table`);
        // Clears the array locally
    } catch (error: any) {
      console.error("Table content reset failed", error.message);
    }
  }

  const handle_table_reset = async () => {
    await reset_table_content();
  };

  async function delete_supply_post(post_id: string) {
    try {
      const response = await axios.post(`${SERVER_URL}/delete_supply_post`, { id: post_id });
      
      if (response.status === 200) {
        await fetch_active_supply_posts();
      }

    } catch(error: any) {
      console.error("Failed to delete post");
    }
  }

  const handle_supply_post_deletion = async (post_id: string) => {
    await delete_supply_post(post_id);
  };

  async function edit_supply_post(post_id: string) {
    try {

      const new_post_data = {
        id: post_id,    // ID
        owner_id: "10",    // Owner ID
        title: title,   // title
        description: description,    // description
        price: price,    // price
        category: category,   // category
        location: location,   // location
        post_picture_url: post_picture_url,   // post_picture_url
        created_at: "tmp"    // 
      };

      const response = await axios.post(`${SERVER_URL}/edit_supply_post`, new_post_data);
      
      if (response.status === 200) {
        await fetch_active_supply_posts();
      }

    } catch(error: any) {
      console.error("Failed to delete post");
    }
  }

  const handle_supply_post_editing = async (post_id: string) => {
    await edit_supply_post(post_id);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView />
      </View>

      {/* Posts List */}
      <View style={styles.postsContainer}>
        <ScrollView>
          {posts.map((supply_post: Supply_post, index: number) => (
            <View style={styles.post} key={index}>
              <Text style={{ fontWeight: "bold" }}>{supply_post.title}</Text>
              <Text>{supply_post.description}</Text>
			        <Text>{supply_post.price}</Text>
			        <Text>{supply_post.category}</Text>
              <TouchableOpacity style={styles.minibutton} onPress={() => handle_supply_post_deletion(supply_post.id)}>
              <Text>Radera</Text>
              </TouchableOpacity>
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
        value={description}
        onChangeText={set_description}
      />
      <TextInput
        style={styles.input}
        placeholder="Pris"
        value={price}
        keyboardType="numeric" // Restricts keyboard to numeric input
        onChangeText={(text) => {
          // Filter input to allow only numeric values
          const numericValue = text.replace(/[^0-9]/g, ''); // Removes non-numeric characters
          set_price(numericValue);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Kategori"
        value={category}
        onChangeText={set_category}
      />
    <TouchableOpacity style={styles.button} onPress={handle_new_supply_post}>
      <Text>Skapa annons</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={handle_table_reset}>
      <Text>Rensa annonser (temp. för utvecklare)</Text>
    </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
	padding: 30,
    backgroundColor: "#b0ffe3",
    alignItems: "center", // Center children horizontally
  },
  mapContainer: {
    width: "90%",
    height: 150,
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
    height: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "white",
    alignSelf: "center", // Ensure posts are centered
  },
  post: {
    width: "90%", // Relative to postsContainer
    height: 100,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "white",
    borderBlockColor: "black",
    alignSelf: "center", // Center individual posts
  },
  input: {
    width: "60%", // Match other components
    height: 40,
    margin: 12,
    borderWidth: 1,
	  color: "#949494", 
    padding: 10,
    borderRadius: 5,
    backgroundColor: "white",
    alignSelf: "center", // Ensure inputs are centered
  },
  button: {
    backgroundColor: '#ffffff', // Button color
    paddingVertical: 12, // Vertical padding for height
    paddingHorizontal: 20, // Horizontal padding for width
    borderRadius: 5, // Rounded corners (adjust as needed)
    elevation: 5,
    alignItems: 'center',
    margin: 5,
  },
  minibutton: {
    backgroundColor: '#ff4155', // Button color
    paddingVertical: 2, // Vertical padding for height
    paddingHorizontal: 5, // Horizontal padding for width
    borderRadius: 5, // Rounded corners (adjust as needed)
    elevation: 5,
    alignItems: 'center',
    margin: 2,
  },
});
