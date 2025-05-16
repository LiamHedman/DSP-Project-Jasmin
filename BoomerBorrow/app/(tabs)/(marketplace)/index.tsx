import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Mapbox, { MapView, Camera, MarkerView } from "@rnmapbox/maps";
import * as Location from "expo-location";
import { Supply_post } from "./../../../classes_tmp";
import { get_user_id } from "@/auth_token";
import { useRouter } from "expo-router";

// Set the Mapbox access token
Mapbox.setAccessToken(
  "pk.eyJ1Ijoicm9zbzQ3ODUiLCJhIjoiY205dnRmb21tMGx0MzJpc20xaTBqZ2s5MCJ9.2vZamz2nGj3EQgNRqTC4aA"
);

type Post = {
  type: string;
  data: {
    title: string;
    bio: string;
    location: [number, number];
  };
};

export default function MarketplaceScreen() {
  const router = useRouter();
  const SERVER_URL = "http://localhost:3000";
  let supply_post: Supply_post;

  const [title, set_title] = useState("");
  const [description, set_description] = useState("");
  const [price, set_price] = useState("");
  const [category, set_category] = useState("");
  const [location, set_location] = useState("");
  const [post_picture_url, set_post_picture_url] = useState("");

  const [posts, set_posts] = useState<Supply_post[]>([]);
  const [extraPosts, setExtraPosts] = useState<Post[]>([]); // From second code

  // Map-related states
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchText, setSearchText] = useState("");
  const [cameraCoords, setCameraCoords] = useState<[number, number] | null>(null);
  const [cameraKey, setCameraKey] = useState(0);

  useEffect(() => {
    fetch_active_supply_posts();
    fetchUserLocation();
    fetchExtraPosts(); // From second code
  }, []);

  async function fetch_active_supply_posts() {
    try {
      const response = await axios.get(`${SERVER_URL}/fetch_all_supply_posts`);
      set_posts(response.data);
    } catch (error: any) {
      console.error("Failed to fetch active_supply_posts:", error.message);
    }
  }

  async function fetchExtraPosts() {
    try {
      const response = await axios.get(`${SERVER_URL}/fetch_posts`);
      setExtraPosts(response.data);
    } catch (error: any) {
      console.error("Failed to fetch extra posts:", error.message);
    }
  }

  async function fetchUserLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }
      const userLoc = await Location.getCurrentPositionAsync({});
      const coords: [number, number] = [userLoc.coords.longitude, userLoc.coords.latitude];
      setUserLocation(coords);
      setCameraCoords(coords);
      setCameraKey((prev) => prev + 1); // force camera update on location fetch
    } catch (error) {
      console.error("Error getting user location:", error);
    }
  }

  async function send_supply_post() {
    try {
      const created_at = new Date().toISOString();
      const owner_id = await get_user_id();
      if (owner_id === null) throw new Error("Owner id cannot be null upon post creation");

      supply_post = new Supply_post(
        owner_id,
        title,
        description,
        price,
        category,
        location,
        post_picture_url,
        created_at
      );

      await axios.post(`${SERVER_URL}/new_supply_post`, supply_post, {
        headers: { auth: `${await get_user_id()}` },
      });

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
    } catch (error: any) {
      console.error("Failed to delete post");
    }
  }

  const handle_supply_post_deletion = async (post_id: string) => {
    await delete_supply_post(post_id);
  };

  async function edit_supply_post(post_id: string) {
    try {
      const new_post_data = {
        id: post_id,
        owner_id: "10",
        title,
        description,
        price,
        category,
        location,
        post_picture_url,
        created_at: "tmp",
      };

      const response = await axios.post(`${SERVER_URL}/edit_supply_post`, new_post_data);
      if (response.status === 200) {
        await fetch_active_supply_posts();
      }
    } catch (error: any) {
      console.error("Failed to delete post");
    }
  }

  const handle_supply_post_editing = async (post_id: string) => {
    await edit_supply_post(post_id);
  };

  const handleCitySearch = async () => {
    if (!searchText) return;
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchText
        )}.json?access_token=pk.eyJ1Ijoicm9zbzQ3ODUiLCJhIjoiY205dnRmb21tMGx0MzJpc20xaTBqZ2s5MCJ9.2vZamz2nGj3EQgNRqTC4aA`
      );
      const features = response.data.features;
      if (features.length > 0) {
        const [lon, lat] = features[0].center;
        setCameraCoords([lon, lat]);
        setCameraKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error searching city:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Sök efter stad..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleCitySearch}
        />
        <TouchableOpacity onPress={handleCitySearch} style={styles.searchButton}>
          <Text style={{ color: "white" }}>Sök</Text>
        </TouchableOpacity>
      </View>

      {/* Your Location Button */}
      <TouchableOpacity
        onPress={fetchUserLocation}
        style={{
          backgroundColor: "#007AFF",
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
          alignSelf: "center",
          width: "90%",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>Your Location</Text>
      </TouchableOpacity>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView style={styles.map}>
          {cameraCoords && (
            <Camera
              key={cameraKey}
              centerCoordinate={cameraCoords}
              zoomLevel={10}
              animationMode="flyTo"
              animationDuration={1000}
            />
          )}
          {posts.map((p, i) => {
            const coords = p.location.split(",").map((n) => parseFloat(n));
            const isValidCoords = coords.length === 2 && coords.every((c) => !isNaN(c));
            return isValidCoords ? (
              <MarkerView key={i} coordinate={[coords[0], coords[1]]}>
                <View style={{ backgroundColor: "blue", padding: 4, borderRadius: 6 }}>
                  <Text style={{ color: "white", fontSize: 10 }}>{p.title}</Text>
                </View>
              </MarkerView>
            ) : null;
          })}
          {/* Extra markers from second code */}
          {extraPosts.map((p, i) => (
            <MarkerView key={`extra-${i}`} coordinate={p.data.location}>
              <View style={{ backgroundColor: "green", padding: 4, borderRadius: 6 }}>
                <Text style={{ color: "white", fontSize: 10 }}>{p.data.title}</Text>
              </View>
            </MarkerView>
          ))}

          {userLocation && (
            <MarkerView coordinate={userLocation}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: "red",
                  borderWidth: 2,
                  borderColor: "white",
                }}
              />
            </MarkerView>
          )}

        </MapView>
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
              <TouchableOpacity
                style={styles.minibutton}
                onPress={() => handle_supply_post_deletion(supply_post.id)}
              >
                <Text>Radera</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Input Fields and Button */}
      <TextInput style={styles.input} placeholder="Titel" value={title} onChangeText={set_title} />
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
        keyboardType="numeric"
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, "");
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
    marginHorizontal: 10,
  },
  mapContainer: {
    height: 250,
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
  postsContainer: {
    flex: 1,
    marginBottom: 10,
  },
  post: {
    backgroundColor: "lightgray",
    padding: 10,
    marginVertical: 5,
    borderRadius: 6,
  },
  minibutton: {
    backgroundColor: "red",
    padding: 6,
    marginTop: 5,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 6,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    marginVertical: 5,
    borderRadius: 6,
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 6,
    padding: 8,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 6,
    justifyContent: "center",
  },
});
