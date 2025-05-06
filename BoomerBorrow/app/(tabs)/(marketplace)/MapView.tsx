// app/(tabs)/(marketplace)/MapView.tsx (React Native)
import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

MapboxGL.setAccessToken('pk.eyJ1Ijoicm9zbzQ3ODUiLCJhIjoiY205Z3Q4azlpMXN6cTJrcXc3anNhN2d2eCJ9.gYQgEn_h2O1CGIxWkEpcdA');

export default function MapView() {
  useEffect(() => {
    MapboxGL.requestAndroidLocationPermissions();
  }, []);

  return (
    <View style={styles.page}>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={[18.063240, 59.334591]} // Stockholm
        />
      </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  map: { flex: 1 },
});

if (Platform.OS === 'web') {
  module.exports = require('./MapView.web');  // Ensure it falls back to the web version
} else {
  module.exports = require('./MapView.native');  // Fallback to the native version for mobile
}