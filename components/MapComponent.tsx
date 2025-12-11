import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GeoData } from '../types';

// Fix Leaflet marker icon issue by using CDN URLs instead of local imports
// which can fail in browser-based ESM environments.
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
  useEffect(() => {
    map.flyTo(center, 13, {
      duration: 1.5
    });
  }, [center, map]);
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ geoData }) => {
  if (!geoData || !geoData.loc) {
    return (
      <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400">
        Loading Map...
      </div>
    );
  }

  const [lat, lng] = geoData.loc.split(',').map(Number);
  const position: [number, number] = [lat, lng];

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 z-0">
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
};

export default MapComponent;