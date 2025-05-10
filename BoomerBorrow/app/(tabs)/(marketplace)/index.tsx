import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import axios from "axios";

import Mapbox, { MapView, Camera, MarkerView } from "@rnmapbox/maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Supply_post } from "./../../../classes_tmp";
import { get_user_id } from "@/auth_token";
//import token_storage from "@/token_storage";

Mapbox.setAccessToken("pk.eyJ1Ijoicm9zbzQ3ODUiLCJhIjoiY205dnRmb21tMGx0MzJpc20xaTBqZ2s5MCJ9.2vZamz2nGj3EQgNRqTC4aA");

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [searchText, setSearchText] = useState("");
  const [cameraCoords, setCameraCoords] = useState<[number, number] | null>(null);
  const [cameraKey, setCameraKey] = useState(0);

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

    async function fetchUserLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("Permission to access location was denied");
          return;
        }

        const userLocation = await Location.getCurrentPositionAsync({});
        const { longitude, latitude } = userLocation.coords;
        const coords: [number, number] = [longitude, latitude];
        setLocation(coords);
        setCameraCoords(coords); // Initial map center on user
      } catch (error) {
        console.error("Error getting user location:", error);
      }
    }

    fetchPosts();
    fetchUserLocation();
  }, []);

  async function delete_supply_post(post_id: string) {
    try {
      const response = await axios.post(`${SERVER_URL}/delete_supply_post`, { id: post_id });
      
      if (response.status === 200) {
        await fetch_active_supply_posts();
      }
  const examplePosts: Post[] = [
    {
      type: "advertisement",
      data: {
        title: "Motorsåg",
        bio: "Väldigt härlig motorsåg, kan skära upp allting",
        location: [17.6389, 59.8586],
      },
    },
  ];

  const handleCitySearch = async () => {
    if (!searchText) return;

  const handle_supply_post_deletion = async (post_id: string) => {
    await delete_supply_post(post_id);
  };

  async function edit_supply_post(post_id: string) {
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
        setCameraKey((prev) => prev + 1); // Force Camera re-render
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

        <TouchableOpacity
          onPress={() => {
            if (location) {
              setCameraCoords(location);     // move camera
              setCameraKey(prev => prev + 1); // trigger re-render of <Camera>
            } else {
              console.warn("Plats ej tillgänglig ännu.");
            }
          }}
          style={styles.searchButton}
        >
          <Text style={{ color: "white" }}>Min plats</Text>
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView style={styles.map}>
          {cameraCoords && (
            <Camera
              key={cameraKey}
              zoomLevel={14}
              centerCoordinate={cameraCoords}
              animationMode="flyTo"
              animationDuration={1000}
            />
          )}

          {location && (
            <MarkerView coordinate={location}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "red",
                  borderWidth: 2,
                  borderColor: "white",
                }}
              />
            </MarkerView>
          )}

          <MarkerView coordinate={[17.6389, 59.8586]} key="motorsag">
            <TouchableOpacity onPress={() => router.push("/(tabs)/(marketplace)/(annons)/post")}>
              <View style={styles.annotationContainer}>
                <Text style={styles.annotationText}>Motorsåg</Text>
              </View>
            </TouchableOpacity>
          </MarkerView>
        </MapView>
      </View>

      {/* Posts */}
      <View style={styles.postsContainer}>
        <ScrollView>
          <TouchableOpacity
            style={styles.post}
            key={0}
            onPress={() => router.push("/(tabs)/(marketplace)/(annons)/post")}
          >
            <Text>Verktygaren</Text>
            <Text>Motorsåg</Text>
          </TouchableOpacity>

          {examplePosts.map((postData: Post, index: number) => (
            <View style={styles.post} key={index}>
              <Text style={{ fontWeight: "bold" }}>{supply_post.title}</Text>
              <Text>{supply_post.description}</Text>
			        <Text>{supply_post.price}</Text>
			        <Text>{supply_post.category}</Text>
              <TouchableOpacity style={styles.minibutton} onPress={() => handle_supply_post_deletion(supply_post.id)}>
              <Text>Radera</Text>
              </TouchableOpacity>

              <Text>{postData.data?.title}</Text>
              <Text>{postData.data?.bio}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
	padding: 30,
    backgroundColor: "#b0ffe3",
    alignItems: "center", // Center children horizontally

    backgroundColor: "beige",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    backgroundColor: "white",
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  mapContainer: {
    width: "90%",
    height: 150,
    margin: 12,
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    alignSelf: "center",
  },
  map: {
    flex: 1,
  },
  postsContainer: {
    width: "90%", // Match other components
    height: 200,
    flex: 1,
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
  annotationContainer: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  annotationText: {
    color: "white",
    fontSize: 12,
  },
});