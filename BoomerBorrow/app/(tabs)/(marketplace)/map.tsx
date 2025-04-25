import React, { useEffect } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

MapboxGL.setAccessToken(
  'pk.eyJ1Ijoicm9zbzQ3ODUiLCJhIjoiY205Z3Q4azlpMXN6cTJrcXc3anNhN2d2eCJ9.gYQgEn_h2O1CGIxWkEpcdA'
);

export default function MapScreen() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.js';
      script.onload = () => {
        const mapboxgl = (window as any).mapboxgl;
        mapboxgl.accessToken =
          'pk.eyJ1Ijoicm9zbzQ3ODUiLCJhIjoiY205Z3Q4azlpMXN6cTJrcXc3anNhN2d2eCJ9.gYQgEn_h2O1CGIxWkEpcdA';
        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [18.063240, 59.334591],
          zoom: 12,
        });
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      };
      document.body.appendChild(script);
    }
  }, []);

  if (Platform.OS === 'web') {
    return <div id="map" style={{ height: '100vh', width: '100%' }} />;
  }

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={[18.063240, 59.334591]}
        />
      </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '90%',
    borderRadius: 5,
    marginVertical: 12,
    overflow: 'hidden',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  map: {
    flex: 1,
  },
});
