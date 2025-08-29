import React, { useState } from "react";
import { Box, TextField, Button, Typography, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = () => {
        if (email && password) {
            // Fake registration
            localStorage.setItem("token", "dummy-token");
            navigate("/");
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Card sx={{ p: 4, width: 400 }}>
                <Typography variant="h5" mb={3}>Register</Typography>
                <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
                <TextField fullWidth type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} />
                <Button fullWidth variant="contained" onClick={handleRegister}>Register</Button>
            </Card>
        </Box>
    );
};

export default Register;
