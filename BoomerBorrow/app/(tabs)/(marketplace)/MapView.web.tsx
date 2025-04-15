import React from 'react';
import Map, { NavigationControl } from 'react-map-gl';

const MAPBOX_TOKEN = "pk.eyJ1IjoibWFxZGEiLCJhIjoiY20zbnVkNG80MTZxOTJqczV0OXUxaGI2dyJ9.CsQOcikMeIMQt1kSEM9WNA";

export default function MapView() {
  return (
    <Map
      initialViewState={{
        longitude: 18.063240,
        latitude: 59.334591,
        zoom: 10
      }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
      style={{ width: '100%', height: '100%' }}
    >
      <NavigationControl position="top-right" />
    </Map>
  );
}
