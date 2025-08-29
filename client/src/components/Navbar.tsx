import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    nav("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#2961ad",
        boxShadow: "0px 3px 10px rgba(0,0,0,0.3)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "white", cursor: "pointer" }}
          >
            WeatherPulse India
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar
              sx={{ bgcolor: "#fff", color: "#2961ad", fontWeight: "bold" }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              },
            }}
          >
            <MenuItem disabled>
              <Typography variant="body1">
                Welcome, <b>{user?.name || "Guest"}</b>
              </Typography>
            </MenuItem>
            <Divider sx={{ color: "rgba(41,97,173,0.25)", width: "10px" }} />
            <MenuItem
              onClick={handleLogout}
              sx={{ color: "#d32f2f", fontWeight: 500, cursor: "pointer" }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
