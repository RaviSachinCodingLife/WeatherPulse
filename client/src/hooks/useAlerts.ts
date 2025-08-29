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
        dispatch(setAlerts(data)); 
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
      dispatch(addAlert(alert));
    };

    return () => evtSource.close();
  }, [dispatch]);
};

export default useAlerts;
