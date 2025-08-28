import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch } from "../hooks/reduxHooks";
import { addAlert } from "../store/slices/alertsSlice";

let socket: Socket | null = null;

export const useWebSocket = (
  url = import.meta.env.VITE_WS_URL || "http://localhost:4000"
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket = io(url, { transports: ["websocket", "polling"] });

    socket.on("connect", () => {
      console.log("WS connected", socket?.id);
    });

    socket.on("weather-alert", (payload: any) => {
      // payload should be our AlertItem
      dispatch(addAlert(payload));
    });

    socket.on("weather-update", (payload: any) => {
      // optional: partial update for many points (e.g., small marker updates)
      // you can dispatch to store if you keep a map of live points
    });

    return () => {
      socket?.disconnect();
    };
  }, [dispatch, url]);
};
