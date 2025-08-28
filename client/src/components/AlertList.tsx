import React from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import type { AlertItem } from "../store/slices/alertsSlice";

const AlertList: React.FC = () => {
    // Select items array instead of whole slice
    const alerts = useAppSelector((state) => state.alerts.items);

    // Remove duplicates by id
    const uniqueAlerts: AlertItem[] = Array.from(
        new Map(alerts.map((a) => [a.id, a])).values()
    );

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Disaster Alerts</h2>
            <ul className="space-y-3">
                {uniqueAlerts.map((alert) => (
                    <li
                        key={alert.id}
                        className="p-3 border rounded-lg shadow bg-white"
                    >
                        <p className="font-semibold">{alert.title}</p>
                        {alert.description && <p>{alert.description}</p>}
                        <p className="text-gray-500 text-sm">
                            {new Date(alert.timestamp).toLocaleString()}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AlertList;
