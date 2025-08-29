import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const API = "http://localhost:4000";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        email,
        password,
        name,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
    } catch (e: any) {
      alert(e.response?.data?.error || "Register failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          maxWidth: 420,
          width: "100%",
          borderRadius: 3,
          border: "2px solid rgba(41,97,173,0.25)",
          boxShadow: "0 6px 20px rgba(41,97,173,0.25)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          sx={{ mb: 1, color: "#2961ad" }}
        >
          Create Account
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 4, color: "text.secondary" }}
        >
          Register to get started
        </Typography>

        <form onSubmit={submit}>
          <TextField
            fullWidth
            variant="outlined"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              bgcolor: "#2961ad",
              py: 1.3,
              fontSize: "1rem",
              borderRadius: 2,
              fontWeight: "bold",
              "&:hover": { bgcolor: "#1f4c86" },
            }}
          >
            Register
          </Button>
        </form>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 3, color: "text.secondary" }}
        >
          Already have an account?{" "}
          <Link
            component="button"
            underline="hover"
            onClick={() => navigate("/login")}
            sx={{ color: "#2961ad", fontWeight: "bold" }}
          >
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
