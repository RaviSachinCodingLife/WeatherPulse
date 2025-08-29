import { useEffect } from "react";
import { useAppDispatch } from "../hooks/reduxHooks";
import { addAlert, setAlerts } from "../store/slices/alertsSlice";

const useAlerts = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchInitialAlerts = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/alerts");
        const data = await res.json();

        const uniqueAlertsMap = new Map<string, (typeof data)[0]>();
        data.forEach((alert: any) => {
          if (alert.id) uniqueAlertsMap.set(alert.id, alert);
        });

        const uniqueAlerts = Array.from(uniqueAlertsMap.values());

        uniqueAlerts.forEach((alert) => {
          if (alert.location?.coordinates) {
            alert.coords = [
              alert.location.coordinates[1],
              alert.location.coordinates[0],
            ];
          }
        });

        dispatch(setAlerts(uniqueAlerts));
      } catch (err) {
        console.error("Failed to fetch initial alerts", err);
      }
    };

    fetchInitialAlerts();

    const evtSource = new EventSource(
      "http://localhost:4000/api/alerts/stream"
    );

    evtSource.onmessage = (event) => {
      const alert = JSON.parse(event.data);

      if (alert.location?.coordinates) {
        alert.coords = [
          alert.location.coordinates[1],
          alert.location.coordinates[0],
        ];
      }

      dispatch((dispatch, getState) => {
        const existingIds = new Set(
          getState().alerts.items.map((a: any) => a.id)
        );
        if (!existingIds.has(alert.id)) {
          dispatch(addAlert(alert));
        }
      });
    };

    return () => evtSource.close();
  }, [dispatch]);
};

export default useAlerts;
