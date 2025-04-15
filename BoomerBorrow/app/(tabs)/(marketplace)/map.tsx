import React from 'react';
import { View, Text, Platform } from 'react-native';

// The mapbox token generated on mapbox official website
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFxZGEiLCJhIjoiY20zbnVkNG80MTZxOTJqczV0OXUxaGI2dyJ9.CsQOcikMeIMQt1kSEM9WNA';

// Style the map 
export default function MapScreen() {
  if (Platform.OS === 'web') {
    const Map = require('react-map-gl').default;
    const { NavigationControl } = require('react-map-gl');

    return (
      <View style={{ flex: 1 }}>
        <Map
          initialViewState={{
            longitude: 18.063240,
            latitude: 59.334591,
            zoom: 14,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          <NavigationControl position="top-right" />
        </Map>
      </View>
    );
  }

  // Native fallback
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Map not supported on native yet.</Text>
    </View>
  );
}
