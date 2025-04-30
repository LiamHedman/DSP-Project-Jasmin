import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapViewNative() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
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
  map: {
    flex: 1,
  },
});
