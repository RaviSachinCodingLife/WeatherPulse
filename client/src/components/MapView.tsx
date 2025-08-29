import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useAppSelector } from "../hooks/reduxHooks";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useAlerts from "../hooks/useAlerts";

interface Alert {
  id: string;
  type: string;
  title: string;
  coords?: [number, number];
  severity?: number;
}

const getIcon = (type: string, severity?: number) => {
  const size = 32 + (severity ? severity * 2 : 0);
  const colorMap: Record<string, string> = {
    storm: "#f1c40f",
    flood: "#3498db",
    earthquake: "#e74c3c",
    drought: "#d35400",
  };
  return new L.DivIcon({
    html: `<div style="font-size:${size}px;color:${
      colorMap[type] || "#95a5a6"
    }">⚠️</div>`,
    className: "", // remove default leaflet styles
  });
};

const MapView: React.FC = () => {
  useAlerts();
  const alerts = useAppSelector((s) => s.alerts.items);

  // Memoize latest alert per state to avoid duplicates
  const latestPerState = useMemo(() => {
    const map = new Map<string, Alert>();
    alerts.forEach((a) => {
      if (a.coords) {
        map.set(a.title, a); // only keep the latest alert per state
      }
    });
    return [...map.values()];
  }, [alerts]);

  return (
    <MapContainer
      center={[22.9734, 78.6569]}
      zoom={5}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {latestPerState.map((alert) => (
        <Marker
          key={alert.id}
          position={alert.coords as [number, number]}
          icon={getIcon(alert.type, alert.severity)}
        />
      ))}
    </MapContainer>
  );
};

export default MapView;
