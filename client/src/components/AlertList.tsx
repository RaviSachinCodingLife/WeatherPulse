import React, { useMemo, type JSX } from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import { Card, CardContent, Typography, Box } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import WaterIcon from "@mui/icons-material/Water";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import GrainIcon from "@mui/icons-material/Grain";

const alertIcons: Record<string, JSX.Element> = {
  storm: <BoltIcon style={{ color: "#f1c40f" }} />,
  flood: <WaterIcon style={{ color: "#3498db" }} />,
  earthquake: <AcUnitIcon style={{ color: "#e74c3c" }} />,
  drought: <GrainIcon style={{ color: "#d35400" }} />,
};

const getBorderColor = (type: string) => {
  switch (type) {
    case "storm":
      return "#f1c40f";
    case "flood":
      return "#3498db";
    case "earthquake":
      return "#e74c3c";
    case "drought":
      return "#d35400";
    default:
      return "#95a5a6";
  }
};

const AlertList: React.FC = () => {
  const alerts = useAppSelector((s) => s.alerts.items);

  // Memoize rendered alerts for performance
  const renderedAlerts = useMemo(
    () =>
      alerts.map((alert) => (
        <Card
          key={alert.id}
          sx={{
            mb: 2,
            borderRadius: 3,
            background: "rgba(255,255,255,0.1)",
            borderLeft: `5px solid ${getBorderColor(alert.type)}`,
            color: "#fff",
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              {alertIcons[alert.type]}
              <Typography variant="h6" sx={{ ml: 1 }}>
                {alert.title}
              </Typography>
            </Box>
            <Typography variant="body2">{alert.description}</Typography>
            <Typography variant="caption">
              {new Date(alert.timestamp).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      )),
    [alerts]
  );

  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        backdropFilter: "blur(10px)",
        background: "rgba(0,0,0,0.3)",
        borderRadius: 3,
        p: 2,
      }}
    >
      {renderedAlerts}
    </Box>
  );
};

export default AlertList;
