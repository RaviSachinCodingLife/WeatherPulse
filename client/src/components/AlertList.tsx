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

const AlertList: React.FC = () => {
  const alerts = useAppSelector((s) => s.alerts.items);

  const uniqueAlerts = useMemo(() => {
    const seen = new Set<string>();
    return alerts.filter((a) => {
      if (seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    });
  }, [alerts]);
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
      {uniqueAlerts.map((alert) => (
        <Card
          key={alert.id}
          sx={{
            mb: 2,
            borderRadius: 3,
            background: "rgba(255,255,255,0.1)",
            borderLeft: `5px solid ${
              alert.type === "storm"
                ? "#f1c40f"
                : alert.type === "flood"
                ? "#3498db"
                : alert.type === "earthquake"
                ? "#e74c3c"
                : "#d35400"
            }`,
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
      ))}
    </Box>
  );
};

export default AlertList;
