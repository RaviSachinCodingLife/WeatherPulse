import React from "react";
import { Grid, Card, Typography, Box } from "@mui/material";
import IndiaMap from "./components/MapView";
import AlertList from "./components/AlertList";
import WeatherWidget from "./components/WeatherWidget";
import { useAppSelector } from "./hooks/reduxHooks";
import { useWebSocket } from "./hooks/useWebSocket";
const App: React.FC = () => {
  useWebSocket();
  const alerts = useAppSelector((s) => s.alerts.items);
  console.log({ alerts });
  return (
    <Box sx={{ height: "100vh", width: "100vw", bgcolor: "grey.900" }}>
      <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
        🛰 WeatherPulse India — Disaster Alert System
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 4, md: 8, xl: 8 }}>
          <Card sx={{ borderRadius: 3, display: "flex", gap: 2 }}>
            <IndiaMap /> <AlertList />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 4, xl: 4 }}>
          <WeatherWidget />
        </Grid>
      </Grid>
    </Box>
  );
};
export default App;
