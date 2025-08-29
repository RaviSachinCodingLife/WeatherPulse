import React from "react";
import { Box, Grid, Typography, Card, CardContent } from "@mui/material";
import acroccmedia from "../assets/image/acroccmedia.png";
import reccievealert from "../assets/image/reccievealert.png";
import manmade from "../assets/image/manmade.png";
import multilang from "../assets/image/multilang.png";
import playstore from "../assets/image/googlePlayStore_noBG.png";
import appstore from "../assets/image/appleAppStore_noBG.png";
import rssIcon from "../assets/image/feed_blue.png";
import alarmOff from "../assets/image/alarmoff.png";

const features = [
  {
    id: "multiHazards",
    img: manmade,
    title: "Multi Hazards",
    description: "For all natural & man-made disasters",
  },
  {
    id: "geoTargeted",
    img: reccievealert,
    title: "Geo Targeted Alerts",
    description: "Receive alerts in geo-targeted manner",
  },
  {
    id: "multiLingual",
    img: multilang,
    title: "Multi Lingual",
    description: "Alerts available in multiple languages",
  },
  {
    id: "multiMedia",
    img: acroccmedia,
    title: "Simultaneous Alerts",
    description: "Disseminated across all media at the same time",
  },
];

const About: React.FC = () => {
  return (
    <Box
      id="aboutSachet"
      sx={{
        py: 8,
        px: { xs: 2, md: 6 },
        bgcolor: "#2961ad",
        color: "white",
        textAlign: "center",
      }}
    >
      {/* Title */}
      <Typography variant="h3" fontWeight="bold" gutterBottom mb={4}>
        About
      </Typography>

      {/* Intro */}
      <Typography
        variant="h6"
        sx={{
          maxWidth: "900px",
          mx: "auto",
          mb: 6,
          opacity: 0.85,
          lineHeight: 1.6,
        }}
      >
        National Disaster Management Authority (NDMA) under the chairmanship of
        Hon'ble Prime Minister of India has envisioned a CAP-based Integrated
        Alert System on a Pan India basis. The project involves near real-time
        dissemination of early warnings through multiple technologies using
        geo-intelligence.
      </Typography>

      {/* Features Grid */}
      <Grid container spacing={4} justifyContent="center" mb={8}>
        {features.map((feature) => (
          <Grid size={{ xs: 12, sm: 12, md: 3, xl: 3 }} key={feature.id}>
            <Card
              sx={{
                borderRadius: 6,
                bgcolor: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(14px)",
                boxShadow: "0 8px 32px rgba(255, 252, 252, 0.2)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 36px rgba(255, 252, 252, 0.6)",
                },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: 3,
              }}
            >
              <Box
                component="img"
                src={feature.img}
                alt={feature.title}
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ color: "#fff" }}
                >
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CAP Integrated Alert System Section */}
      <Grid container spacing={6} alignItems="center" mt={2}>
        <Grid size={{ xs: 12, sm: 12, md: 6, xl: 6 }}>
          <Box display={"flex"} flexDirection={"column"} gap={2}>
            <Typography variant="h4" fontWeight="bold">
              CAP Integrated Alert System
            </Typography>
            <Box
              component="iframe"
              src="https://www.youtube.com/embed/N_ljJTs4Pfs"
              title="CAP Integrated Alert System"
              width="100%"
              height="400px"
              style={{ borderRadius: "12px" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
        </Grid>

        {/* Right: Features list (SMS, App, Browser, RSS) */}
        <Grid
          size={{ xs: 12, sm: 12, md: 6, xl: 6 }}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"flex-start"}
          alignItems={"flex-start"}
          gap={2}
        >
          <Typography variant="h4" fontWeight="bold">
            SMS
          </Typography>
          <Typography variant="body1" fontSize={"18px"} textAlign={"start"}>
            User needs to be attentive when disaster alerts are received via SMS
            from the header <strong>XX-NDMAEW</strong>.
          </Typography>

          <Box display="flex" gap={2} alignItems={"center"}>
            <Typography variant="h4" fontWeight="bold">
              Mobile Application
            </Typography>
            <Box
              component="img"
              src={playstore}
              alt="Google Play"
              width={"30px"}
              height={"30px"}
            />
            <Box
              component="img"
              src={appstore}
              alt="App Store"
              width={"30px"}
              height={"30px"}
            />
          </Box>
          <Typography variant="body1" fontSize={"18px"} textAlign={"start"}>
            This app can be used for weather forecasts as well as reception of
            disaster alerts with multiple location subscriptions.
          </Typography>

          <Box display="flex" gap={2} alignItems={"center"}>
            <Typography variant="h4" fontWeight="bold">
              Browser Notification
            </Typography>
            <Box
              component="img"
              src={alarmOff}
              alt="Browser Notification"
              width={"30px"}
              height={"30px"}
            />
          </Box>
          <Typography variant="body1" fontSize={"18px"} textAlign={"start"}>
            Get notifications directly in your browser (Chrome, Firefox, Edge).
          </Typography>

          <Box display="flex" gap={2} alignItems={"center"}>
            <Typography variant="h4" fontWeight="bold">
              India CAP RSS Feed
            </Typography>
            <Box
              component="img"
              src={rssIcon}
              alt="RSS"
              width={"30px"}
              height={"30px"}
            />
          </Box>
          <Typography variant="body1" fontSize={"18px"} textAlign={"start"}>
            Alerts will be published via RSS feeds so agencies and media can
            further broadcast warnings to the public.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default About;
