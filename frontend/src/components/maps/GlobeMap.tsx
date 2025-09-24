import React, { useEffect, useMemo, useRef, useState } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export interface GlobeMapProps {
  latitude?: number;
  longitude?: number;
  label?: string;
  weather?: { description?: string; tempC?: number; city?: string; country?: string } | null;
  dark?: boolean;
  showRadar?: boolean;
}

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const OWM_API_KEY = process.env.REACT_APP_OWM_API_KEY;

const MAP_STYLES = {
  dark: 'mapbox://styles/mapbox/dark-v10',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  streets: 'mapbox://styles/mapbox/streets-v11',
};

const RADAR_SOURCE_ID = 'owm-radar';
const RADAR_LAYER_ID = 'owm-radar-layer';

const GlobeMap: React.FC<GlobeMapProps> = ({ latitude, longitude, label, weather, dark = true, showRadar }) => {
  const [style, setStyle] = useState(dark ? MAP_STYLES.dark : MAP_STYLES.streets);
  const mapRef = useRef<any>(null);
  const [popupOpen, setPopupOpen] = useState(true);

  const hasTarget = typeof latitude === 'number' && typeof longitude === 'number';

  // Animate zoom from globe -> target
  useEffect(() => {
    const m = mapRef.current?.getMap?.();
    if (!m) return;
    if (hasTarget) {
      // zoom out first
      m.flyTo({ center: [longitude as number, latitude as number], zoom: 2, speed: 1.6, curve: 1.3, essential: true });
      const id = setTimeout(() => {
        m.flyTo({ center: [longitude as number, latitude as number], zoom: 10, speed: 1.2, curve: 1.42, essential: true });
      }, 700);
      return () => clearTimeout(id);
    }
  }, [latitude, longitude, hasTarget]);

  const isGlobe = true;
  const mapKey = style + '-globe';

  // Terrain + sky for globe
  useEffect(() => {
    const m = mapRef.current?.getMap?.();
    if (!m) return;
    const onLoad = () => {
      if (!m.getSource('mapbox-dem')) {
        m.addSource('mapbox-dem', { type: 'raster-dem', url: 'mapbox://mapbox.terrain-rgb', tileSize: 512, maxzoom: 14 });
        m.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      }
      if (!m.getLayer('sky')) {
        m.addLayer({ id: 'sky', type: 'sky', paint: { 'sky-type': 'atmosphere', 'sky-atmosphere-sun-intensity': 15 } });
      }
    };
    if (m.isStyleLoaded()) onLoad(); else m.once('styledata', onLoad);
  }, [style]);

  // Radar overlay
  useEffect(() => {
    const m = mapRef.current?.getMap?.();
    if (!m || !m.isStyleLoaded()) return;

    if (!showRadar) {
      if (m.getLayer(RADAR_LAYER_ID)) m.removeLayer(RADAR_LAYER_ID);
      if (m.getSource(RADAR_SOURCE_ID)) m.removeSource(RADAR_SOURCE_ID);
      return;
    }
    if (!OWM_API_KEY) return;
    if (!m.getSource(RADAR_SOURCE_ID)) {
      m.addSource(RADAR_SOURCE_ID, {
        type: 'raster',
        tiles: [
          `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OWM_API_KEY}`
        ],
        tileSize: 256,
        attribution: 'Radar data © OpenWeatherMap'
      });
    }
    if (!m.getLayer(RADAR_LAYER_ID)) {
      m.addLayer({ id: RADAR_LAYER_ID, type: 'raster', source: RADAR_SOURCE_ID, paint: { 'raster-opacity': 0.7 } });
    }
  }, [showRadar]);

  if (!MAPBOX_TOKEN) {
    return (
      <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0c0f14', color: '#e6f8ff', border: '1px solid #1de9b6', borderRadius: 12 }}>
        Add REACT_APP_MAPBOX_TOKEN to use globe map.
      </div>
    );
  }

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 5, display: 'flex', gap: 8 }}>
        <select value={style} onChange={(e) => setStyle(e.target.value)} style={{ background: '#0c0f14', color: '#e6f8ff', border: '1px solid #1de9b6', borderRadius: 8, padding: '6px 8px' }}>
          <option value={MAP_STYLES.dark}>Dark</option>
          <option value={MAP_STYLES.streets}>Streets</option>
          <option value={MAP_STYLES.satellite}>Satellite</option>
        </select>
      </div>
      <Map
        key={mapKey}
        ref={mapRef}
        mapLib={mapboxgl}
        initialViewState={{ longitude: 0, latitude: 20, zoom: 1.6 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={style}
        mapboxAccessToken={MAPBOX_TOKEN}
        projection={'globe'}
      >
        {hasTarget && (
          <Marker longitude={longitude as number} latitude={latitude as number} anchor="bottom" onClick={() => setPopupOpen(true)}>
            <div style={{ fontSize: 24, cursor: 'pointer' }}>📍</div>
          </Marker>
        )}
        {popupOpen && hasTarget && (
          <Popup longitude={longitude as number} latitude={latitude as number} anchor="bottom" onClose={() => setPopupOpen(false)} closeOnClick={false}>
            <div style={{ minWidth: 140 }}>
              <div style={{ fontWeight: 700, color: '#1de9b6' }}>{label || weather?.city || 'Location'}</div>
              {weather?.description && <div style={{ fontSize: 12, opacity: 0.8 }}>{weather.description}</div>}
              {typeof weather?.tempC === 'number' && <div style={{ fontSize: 16, fontWeight: 700 }}>{weather.tempC.toFixed(1)}°C</div>}
            </div>
          </Popup>
        )}
        <NavigationControl position="top-left" showCompass />
      </Map>
    </div>
  );
};

export default GlobeMap;