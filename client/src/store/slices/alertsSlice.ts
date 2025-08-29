import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Alert {
  id: string;
  type: string;
  title: string;
  description: string;
  coords?: [number, number];
  severity?: number;
  timestamp: string;
}

interface AlertsState {
  items: Alert[];
}

const initialState: AlertsState = {
  items: [],
};

export const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    setAlerts: (state, action: PayloadAction<Alert[]>) => {
      state.items = action.payload;
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.items.push(action.payload);
    },
  },
});

export const { addAlert, setAlerts } = alertsSlice.actions;
export default alertsSlice.reducer;
