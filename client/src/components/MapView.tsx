import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useAppSelector } from "../hooks/reduxHooks";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useAlerts from "../hooks/useAlerts";

const iconFor = (type: string, severity?: number) => {
  const size = 28 + (severity || 0) * 2;
  const colorMap: Record<string, string> = {
    storm: "#f1c40f",
    flood: "#3498db",
    earthquake: "#e74c3c",
    drought: "#d35400",
  };
  const color = colorMap[type] || "#95a5a6";
  return new L.DivIcon({
    className: "",
    html: `<div style="font-size:${size}px;line-height:1;color:${color};text-shadow:0 1px 2px rgba(0,0,0,0.4)">●</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const MapView: React.FC = () => {
  useAlerts();
  const alerts = useAppSelector((s) => s.alerts.items);
  const latestPerState = useMemo(() => {
    const map = new Map<string, (typeof alerts)[0]>();
    for (const a of alerts) {
      if (!a.coords) continue;
      const stateKey = a.title;
      map.set(stateKey, a);
    }
    return Array.from(map.values());
  }, [alerts]);

  return (
    <MapContainer
      center={[22.9734, 78.6569]}
      zoom={5}
      style={{
        height: "100vh",
        maxHeight: "500px",
        width: "100%",
        borderRadius: 3,
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {latestPerState.map((a) => (
        <Marker
          key={a.id}
          position={a.coords as [number, number]}
          icon={iconFor(a.type, a.severity)}
        />
      ))}
    </MapContainer>
  );
};

export default MapView;
