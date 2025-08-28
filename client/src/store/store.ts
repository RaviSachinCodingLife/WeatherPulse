import { configureStore } from "@reduxjs/toolkit";
import alertsReducer from "./slices/alertsSlice";

export const store = configureStore({
  reducer: {
    alerts: alertsReducer,
  },
});

// ✅ Types we need
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
