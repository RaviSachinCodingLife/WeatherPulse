import { useEffect } from "react";
import { useAppDispatch } from "../hooks/reduxHooks";
import { addOrReplaceAlert, setAlerts } from "../store/slices/alertsSlice";

const useAlerts = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchInitialAlerts = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/alerts");
        const data = await res.json();

        dispatch(
          setAlerts(
            data.map((alert: any) => {
              const alertId: string = alert.id ?? `${alert.type}-${Date.now()}`;
              if (alert.location?.coordinates) {
                alert.location = {
                  type: "Point",
                  coordinates: [
                    alert.location.coordinates[0], // lon
                    alert.location.coordinates[1], // lat
                  ],
                };
                alert.coords = [
                  alert.location.coordinates[1],
                  alert.location.coordinates[0],
                ]; // [lat, lon]
              }
              return { ...alert, id: alertId };
            })
          )
        );
      } catch (err) {
        console.error("Failed to fetch initial alerts", err);
      }
    };

    fetchInitialAlerts();

    const evtSource = new EventSource(
      "http://localhost:4000/api/alerts/stream"
    );

    evtSource.onmessage = (event) => {
      try {
        const alert = JSON.parse(event.data);
        const alertId: string = alert.id ?? `${alert.type}-${Date.now()}`;

        if (alert.location?.coordinates) {
          alert.location = {
            type: "Point",
            coordinates: [
              alert.location.coordinates[0], // lon
              alert.location.coordinates[1], // lat
            ],
          };
          alert.coords = [
            alert.location.coordinates[1],
            alert.location.coordinates[0],
          ];
        }

        dispatch(addOrReplaceAlert({ ...alert, id: alertId }));
      } catch (e) {
        console.error("Invalid alert received:", e);
      }
    };

    evtSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      evtSource.close();
    };

    return () => evtSource.close();
  }, [dispatch]);
};

export default useAlerts;
