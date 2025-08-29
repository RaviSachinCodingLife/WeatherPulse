import React, { Suspense } from "react";
import { Box, Card, CircularProgress } from "@mui/material";
import WeatherWidget from "../components/WeatherWidget";
import { useAppSelector } from "../hooks/reduxHooks";
import MapView from "../components/MapView";
import Navbar from "../components/Navbar";
import About from "./About";
import Footer from "./Footer";

const AlertList = React.lazy(() => import("../components/AlertList"));

const Home: React.FC = () => {
  const alerts = useAppSelector((s) => s.alerts.items);
  const isLoading = alerts.length === 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "grey.900",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      <Box
        sx={{
          flex: 1,
          p: 3,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        <Card
          sx={{
            flex: 2,
            borderRadius: 3,
            p: 2,
            display: "flex",
            gap: 2,
            minHeight: 400,
            overflow: "hidden",
          }}
        >
          <MapView />

          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            width={"100%"}
            maxWidth={"400px"}
          >
            {isLoading ? (
              <CircularProgress sx={{ color: "white" }} />
            ) : (
              <Suspense fallback={<CircularProgress sx={{ color: "white" }} />}>
                <AlertList alerts={alerts} />
              </Suspense>
            )}
          </Box>
        </Card>

        <Box
          sx={{
            flex: 1,
            maxWidth: { xs: "100%", md: "320px" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <WeatherWidget />
        </Box>
      </Box>

      {/* Extra Sections */}
      <About />
      <Footer />
    </Box>
  );
};

export default Home;
