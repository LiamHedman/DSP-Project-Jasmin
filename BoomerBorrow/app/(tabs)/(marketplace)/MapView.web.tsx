import React from 'react';

declare global {
  interface Window {
    mapboxgl: any;
  }
}

const MAPBOX_TOKEN = 'pk.eyJ1Ijoicm9zbzQ3ODUiLCJhIjoiY205dnRmb21tMGx0MzJpc20xaTBqZ2s5MCJ9.2vZamz2nGj3EQgNRqTC4aA';

export default function MapViewWeb() {
  React.useEffect(() => {
    // Dynamically load the Mapbox GL JS script for web
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.js';
    script.onload = () => {
      // Initialize Mapbox map once the script is loaded
      const mapboxgl = window.mapboxgl;

      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [18.063240, 59.334591], // Stockholm
        zoom: 12,
        accessToken: MAPBOX_TOKEN,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    };
    document.body.appendChild(script);
  }, []);

  return <div id="map" style={{ height: '100vh' }} />;
}
