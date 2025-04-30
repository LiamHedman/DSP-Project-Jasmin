import React from "react";
import { View, StyleSheet } from "react-native";
import MapboxGL from "@rnmapbox/maps";

MapboxGL.setAccessToken('pk.eyJ1Ijoicm9zbzQ3ODUiLCJhIjoiY205dnRmb21tMGx0MzJpc20xaTBqZ2s5MCJ9.2vZamz2nGj3EQgNRqTC4aA');

const MapViewWeb = () => {
  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera zoomLevel={14} centerCoordinate={[18.063240, 59.334591]} />
      </MapboxGL.MapView>
    </View>
  );
};

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

export default MapViewWeb;
