import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import axios from "axios";
import Mapbox, { MapView, Camera, MarkerView } from "@rnmapbox/maps";  // Use MarkerView from MapboxGL
import * as Location from "expo-location";
import { useRouter } from "expo-router";

// Set the Mapbox access token
Mapbox.setAccessToken("pk.eyJ1Ijoicm9zbzQ3ODUiLCJhIjoiY205dnRmb21tMGx0MzJpc20xaTBqZ2s5MCJ9.2vZamz2nGj3EQgNRqTC4aA");

type Post = {
  type: string;
  data: {
    title: string;
    bio: string;
    location: [number, number]; // Location property now correctly typed as a tuple
  };
};

export default function MarketplaceScreen() {
  const router = useRouter();
  const SERVER_URL = "http://localhost:3000";
  const [posts, setPosts] = useState<Post[]>([]);
  const [location, setLocation] = useState<[number, number] | null>(null); // User's location ([longitude, latitude])

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get(`${SERVER_URL}/fetch_posts`);
        setPosts(response.data);
      } catch (error: any) {
        console.error("Failed to fetch posts:", error.message);
      }
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
        setLocation([longitude, latitude]);
      } catch (error) {
        console.error("Error getting user location:", error);
      }
    }

    fetchPosts();
    fetchUserLocation();
  }, []);

  // Example posts with location for "Motorsåg" in Uppsala
  const examplePosts: Post[] = [
    {
      type: "advertisement",
      data: {
        title: "Motorsåg",
        bio: "Väldigt härlig motorsåg, kan skära upp allting",
        location: [17.6389, 59.8586], // Uppsala coordinates as a tuple
      },
    },
    // You can add more posts here with different locations
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView style={styles.map}>
          {location && (
            <Camera
              zoomLevel={14}
              centerCoordinate={location}
              animationMode="flyTo"
              animationDuration={1000}
            />
          )}

          {/* Add Marker for "Motorsåg" in Uppsala */}
          <MarkerView coordinate={[17.6389, 59.8586]} key="motorsag">
            <View style={styles.annotationContainer}>
              <Text style={styles.annotationText}>Motorsåg</Text>
            </View>
          </MarkerView>

          {/* Add more Markers if you have other posts with locations */}
          {examplePosts.map((postData: Post, index: number) => (
            <MarkerView key={index} coordinate={postData.data.location}>
              <View style={styles.annotationContainer}>
                <Text style={styles.annotationText}>{postData.data.title}</Text>
              </View>
            </MarkerView>
          ))}
        </MapView>
      </View>

      {/* Posts List */}
      <View style={styles.postsContainer}>
        <ScrollView>
          <TouchableOpacity style={styles.post} key={0} onPress={() => router.push("/post")}>
            <Text>Verktygaren</Text>
            <Text>Motorsåg</Text>
          </TouchableOpacity>
          {examplePosts.map((postData: Post, index: number) => (
            <View style={styles.post} key={index}>
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
    backgroundColor: "beige ",
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
  map: {
    flex: 1,
  },
  postsContainer: {
    width: "90%",
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
    borderBlockColor: "black",
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
