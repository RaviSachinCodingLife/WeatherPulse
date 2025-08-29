import React, { useMemo, useState, type JSX } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import WaterIcon from "@mui/icons-material/Water";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import GrainIcon from "@mui/icons-material/Grain";
import InfiniteScroll from "react-infinite-scroller";
import type { AlertItem } from "../store/slices/alertsSlice";

interface AlertListProps {
  alerts: AlertItem[];
}

const alertColors: Record<string, string> = {
  storm: "#f1c40f",
  flood: "#3498db",
  earthquake: "#e74c3c",
  drought: "#d35400",
};

const alertIcons: Record<string, JSX.Element> = {
  storm: <BoltIcon style={{ color: alertColors.storm }} />,
  flood: <WaterIcon style={{ color: alertColors.flood }} />,
  earthquake: <AcUnitIcon style={{ color: alertColors.earthquake }} />,
  drought: <GrainIcon style={{ color: alertColors.drought }} />,
};

const AlertList: React.FC<AlertListProps> = ({ alerts }) => {
  const uniqueAlerts = useMemo(() => {
    const seen = new Set<string>();
    return alerts.filter((a) => {
      if (seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    });
  }, [alerts]);


  const [displayedAlerts, setDisplayedAlerts] = useState<AlertItem[]>(
    uniqueAlerts.slice(0, 50)
  );
  const [hasMore, setHasMore] = useState(true);

  const loadMore = (page: number) => {
    const nextBatch = uniqueAlerts.slice(page * 50, (page + 1) * 50);
    if (nextBatch.length === 0) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setDisplayedAlerts((prev) => [...prev, ...nextBatch]);
    }, 800);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        maxWidth: "360px",
        maxHeight: "520px",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(18px)",
        background: "rgba(255, 255, 255, 0.08)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "rgba(41, 97, 173, 0.85)",
          color: "white",
          px: 2,
          py: 1.2,
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.15)",
        }}
      >
        <Typography variant="h6" fontWeight="bold" letterSpacing={1}>
          🚨 ALERT LIST
        </Typography>
      </Box>

      {/* Infinite Scroll */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.3)",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(255, 255, 255, 0.5)",
          },
        }}
      >
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={hasMore}
          useWindow={false}
          loader={
            <Box
              key="loader"
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 2,
              }}
            >
              <CircularProgress size={28} sx={{ color: "white" }} />
            </Box>
          }
        >
          {displayedAlerts.map((alert) => {
            const color = alertColors[alert.type] || "#fff";
            return (
              <Card
                key={alert.id}
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderLeft: `5px solid ${color}`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.45)",
                  },
                  color: "#fff",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    {alertIcons[alert.type]}
                    <Typography
                      variant="h6"
                      sx={{
                        ml: 1,
                        fontWeight: "bold",
                        color: color,
                      }}
                    >
                      {alert.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ opacity: 0.9 }}
                  >
                    {alert.description ?? "No description available"}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ display: "block", mt: 1, opacity: 0.7 }}
                  >
                    {new Date(alert.timestamp).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </InfiniteScroll>
      </Box>
    </Box>
  );
};

export default AlertList;
