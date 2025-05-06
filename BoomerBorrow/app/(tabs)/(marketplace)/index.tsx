import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import axios from "axios";
import Mapbox, { MapView, Camera, MarkerView } from "@rnmapbox/maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView style={styles.map}>
          {location && (
            <>
              <Camera
                zoomLevel={14}
                centerCoordinate={location}
                animationMode="flyTo"
                animationDuration={1000}
              />
              <Mapbox.MarkerView coordinate={location}>
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: 'red',
                  borderWidth: 2,
                  borderColor: 'white'
                }} />
              </Mapbox.MarkerView>
            </>
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
              <Text>{postData.data?.title}</Text>
              <Text>{postData.data?.bio}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Stylesheet
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



