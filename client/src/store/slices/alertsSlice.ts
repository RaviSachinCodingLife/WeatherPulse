import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AlertItem = {
  id: string;
  type: "storm" | "earthquake" | "flood" | "generic";
  title: string;
  description?: string;
  coords?: [number, number];
  severity?: number;
  timestamp: string;
};

type AlertsState = {
  items: AlertItem[];
};

const initialState: AlertsState = { items: [] };

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    addAlert(state, action: PayloadAction<AlertItem>) {
      state.items.unshift(action.payload);
      // keep list reasonably sized
      if (state.items.length > 500) state.items.pop();
    },
    setAlerts(state, action: PayloadAction<AlertItem[]>) {
      state.items = action.payload;
    },
    clearAlerts(state) {
      state.items = [];
    },
  },
});

export const { addAlert, setAlerts, clearAlerts } = alertsSlice.actions;
export default alertsSlice.reducer;
