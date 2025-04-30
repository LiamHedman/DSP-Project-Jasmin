import React, { useEffect } from "react";
import { Platform, View, StyleSheet, Text } from "react-native";

export default function MapViewWrapper() {
  useEffect(() => {
    if (Platform.OS === "android") {
      const MapboxGL = require("@rnmapbox/maps");
      MapboxGL.requestAndroidLocationPermissions?.();
    }
  }, []);

  if (Platform.OS === "web") {
    const MapboxGL = require("@rnmapbox/maps");
    MapboxGL.setAccessToken("YOUR_MAPBOX_ACCESS_TOKEN_HERE");

    return (
      <View style={styles.container}>
        <MapboxGL.MapView style={{ flex: 1 }}>
          <MapboxGL.Camera
            zoomLevel={14}
            centerCoordinate={[18.063240, 59.334591]}
          />
        </MapboxGL.MapView>
      </View>
    );
  }

  // Only load react-native-maps on iOS/Android
  const { default: MapView, Marker } = require("react-native-maps");

  return (
    <View style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 59.334591,
          longitude: 18.063240,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: 59.334591, longitude: 18.063240 }}
          title="Stockholm"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: "100%",
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
