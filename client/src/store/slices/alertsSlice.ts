import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AlertItem = {
  id: string;
  type: string;
  title: string;
  description?: string;
  coords?: [number, number];
  severity?: number;
  timestamp: string;
};

type AlertsState = { items: AlertItem[] };

const initialState: AlertsState = { items: [] };

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    setAlerts(state, action: PayloadAction<AlertItem[]>) {
      state.items = action.payload;
    },
    addOrReplaceAlert(state, action: PayloadAction<AlertItem>) {
      const a = action.payload;
      // keep latest per state/title
      const existsIndex = state.items.findIndex((x) => x.title === a.title);
      if (existsIndex >= 0) {
        state.items[existsIndex] = a;
      } else {
        state.items.unshift(a);
        // keep limited
        if (state.items.length > 200) state.items.pop();
      }
    },
    clearAlerts(state) {
      state.items = [];
    },
  },
});

export const { setAlerts, addOrReplaceAlert, clearAlerts } =
  alertsSlice.actions;
export default alertsSlice.reducer;
