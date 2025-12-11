import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GeoData } from '../types';

const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  geoData: GeoData | null;
}

const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  const prevCenter = useRef<[number, number]>(center);
  
  useEffect(() => {
    // Only fly if the center actually changed
    if (prevCenter.current[0] !== center[0] || prevCenter.current[1] !== center[1]) {
      map.flyTo(center, 13, {
        duration: 1.5
      });
      prevCenter.current = center;
    }
  }, [center, map]);
  
  return null;
};

const MapComponent: React.FC<MapComponentProps> = React.memo(({ geoData }) => {
  const [initialPosition, setInitialPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (geoData && geoData.loc && !initialPosition) {
      const [lat, lng] = geoData.loc.split(',').map(Number);
      setInitialPosition([lat, lng]);
    }
  }, [geoData, initialPosition]);

  if (!geoData || !geoData.loc || !initialPosition) {
    return (
      <div className="h-full w-full bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
        Loading Map...
      </div>
    );
  }

  const [lat, lng] = geoData.loc.split(',').map(Number);
  const position: [number, number] = [lat, lng];

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 z-0">
      <MapContainer 
        // @ts-ignore
        center={initialPosition} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="text-sm font-sans">
              <strong>{geoData.ip}</strong> <br />
              {geoData.city}, {geoData.country} <br />
              {geoData.org}
            </div>
          </Popup>
        </Marker>
        <MapUpdater center={position} />
      </MapContainer>
    </div>
  );
});

MapComponent.displayName = 'MapComponent';

export default MapComponent;