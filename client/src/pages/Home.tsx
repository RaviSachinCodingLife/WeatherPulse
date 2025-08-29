import React, { useMemo } from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import MapView from "../components/MapView";
import AlertList from "../components/AlertList";
import WeatherWidget from "../components/WeatherWidget";
import { Grid, Card, Typography, Box } from "@mui/material";

const Home: React.FC = () => {
    const alerts = useAppSelector((s) => s.alerts.items);
    const memoizedAlerts = useMemo(() => alerts, [alerts]);
    console.log({ alerts, memoizedAlerts });


    return (
        <Box sx={{ height: "100vh", width: "100vw", bgcolor: "grey.900" }}>
            <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
                🛰 WeatherPulse India — Disaster Alert System
            </Typography>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 12, md: 8, xl: 8 }}>
                    <Card sx={{ borderRadius: 3, display: "flex", gap: 2 }}>
                        <MapView alerts={memoizedAlerts} />
                        <AlertList alerts={memoizedAlerts} />
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4, xl: 4 }}>
                    <WeatherWidget />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;
