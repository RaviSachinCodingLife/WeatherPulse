import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useAppSelector } from '../hooks/reduxHooks';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl
});

export const MapView: React.FC = () => {
    const alerts = useAppSelector((s) => s.alerts.items);

    return (
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <MarkerClusterGroup>
                {alerts.map((a) => a.coords ? (
                    <Marker key={a.id} position={a.coords as [number, number]}>
                        <Popup>
                            <div>
                                <strong>{a.title}</strong>
                                <div>{a.description}</div>
                                <small>{new Date(a.timestamp).toLocaleString()}</small>
                            </div>
                        </Popup>
                    </Marker>
                ) : null)}
            </MarkerClusterGroup>
        </MapContainer>
    );
};
export default MapView;
