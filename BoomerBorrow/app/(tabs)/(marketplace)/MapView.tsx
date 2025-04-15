// app/MapView.tsx
import React from 'react';
import { Platform } from 'react-native';
import Map from 'react-map-gl';
import { NavigationControl } from 'react-map-gl';

// Set the mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFxZGEiLCJhIjoiY20zbnVkNG80MTZxOTJqczV0OXUxaGI2dyJ9.CsQOcikMeIMQt1kSEM9WNA';

// Common map component
const MapView = () => {
  return (
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
  );
};

export default MapView;
