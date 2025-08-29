import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, TextField, Box, Grid, Paper } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import CloudIcon from "@mui/icons-material/Cloud";
import OpacityIcon from "@mui/icons-material/Opacity";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import CompressIcon from "@mui/icons-material/Compress";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import WindPowerIcon from "@mui/icons-material/WindPower";
import CloudImg from "../assets/image/Cloud.avif";
import SunImg from "../assets/image/Sun.avif";
import RainImg from "../assets/image/Rain.avif";
import ThunderImg from "../assets/image/thunder.avif";

interface Weather {
    temp: number;
    description: string;
    city: string;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    pressure: number;
    uv_index: number;
    precipitation: number;
    hourly: any[];
    daily: any[];
}

interface WeatherData {
    dt: number;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        sea_level: number;
        grnd_level: number;
        humidity: number;
        temp_kf: number;
    };
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
    clouds: {
        all: number;
    };
    wind: {
        speed: number;
        deg: number;
        gust: number;
    };
}

const WeatherWidget: React.FC = () => {
    const [weather, setWeather] = useState<Weather | null>(null);
    const [report, setReport] = useState<WeatherData | null>(null);
    const [currreport, setCurrreport] = useState<WeatherData | null>(null);
    const [city, setCity] = useState("");

    const fetchWeather = async (q: string) => {
        try {
            const res = await axios.get(`http://localhost:4000/api/weather?city=${q}`);

            setReport(res.data.daily[0]);
            setWeather(res.data);
        } catch (e) {
            console.error("Weather fetch failed", e);
        }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    try {
                        const res = await axios.get(
                            `http://localhost:4000/api/weather?lat=${latitude}&lon=${longitude}`
                        );
                        setWeather(res.data);
                        setCurrreport(res.data.daily[0])
                        setCity(res.data.city);
                    } catch (e) {
                        fetchWeather("Delhi");
                        setCity("Delhi");
                    }
                },
                () => {
                    fetchWeather("Delhi");
                    setCity("Delhi");
                }
            );
        } else {
            fetchWeather("Delhi");
            setCity("Delhi");
        }
    }, []);

    const getWeatherIcon = (desc: string) => {
        if (!desc) return <CloudIcon style={{ fontSize: 40 }} />;
        if (desc.includes("rain")) return <OpacityIcon style={{ fontSize: 40 }} />;
        if (desc.includes("storm")) return <ThunderstormIcon style={{ fontSize: 40 }} />;
        if (desc.includes("snow")) return <AcUnitIcon style={{ fontSize: 40 }} />;
        if (desc.includes("clear")) return <WbSunnyIcon style={{ fontSize: 40 }} />;
        return <CloudIcon style={{ fontSize: 40 }} />;
    };

    const getBackgroundImage = (desc: string) => {
        if (!desc) return "";
        if (desc.includes("rain")) return RainImg;
        if (desc.includes("storm")) return ThunderImg;
        if (desc.includes("clear")) return SunImg;
        if (desc.includes("cloud")) return CloudImg;
        return "";
    };

    console.log({ weather, report, currreport });


    return (
        <Box sx={{ width: "100%", minHeight: "100vh", py: 5, display: "flex", justifyContent: "center" }}>
            <Card
                sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    color: "#fff",
                    position: "relative",
                    backgroundImage: `url(${getBackgroundImage(weather?.description?.toLowerCase() || "")})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    boxShadow: "0 0 50px rgba(255,255,255,0.2)",
                }}
            >
                <Box sx={{ backdropFilter: "blur(14px)", backgroundColor: "rgba(0,0,0,0.35)" }}>
                    <CardContent>
                        {/* Search */}
                        <Box sx={{ display: "flex", mb: 4 }}>
                            <TextField
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && fetchWeather(city)}
                                placeholder="Enter location..."
                                variant="outlined"
                                size="small"
                                sx={{
                                    flex: 1,
                                    input: { color: "#fff" },
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                                        "&:hover fieldset": { borderColor: "#fff" },
                                    },
                                }}
                            />
                        </Box>

                        {weather && (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 1 }}>
                                    <Typography variant="h1" sx={{ fontWeight: "bold", mr: 3 }}>
                                        {Math.round(weather.temp)}°C
                                    </Typography>
                                    {getWeatherIcon(weather.description.toLowerCase())}
                                </Box>
                                <Typography variant="h5" align="center" sx={{ mb: 1 }}>
                                    {weather.description}
                                </Typography>
                                <Typography variant="subtitle1" align="center" sx={{ mb: 3 }}>
                                    {weather.city} — Last Updated: {new Date().toLocaleString()}
                                </Typography>

                                <Grid container spacing={2} sx={{ mb: 4 }}>
                                    <Grid size={{ xs: 6, sm: 3, md: 2, xl: 2 }} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <WaterDropIcon /> Humidity: {report?.main.humidity || currreport?.main.humidity}%
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 3, md: 2, xl: 2 }} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <WindPowerIcon /> Wind: {report?.wind.speed || currreport?.wind.speed} kph
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 3, md: 2, xl: 2 }} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <CompressIcon /> Pressure: {report?.main.pressure || currreport?.main.pressure} mb
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 3, md: 2, xl: 2 }} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <DeviceThermostatIcon /> Feels Like: {Math.round((report?.main.feels_like || currreport?.main.humidity) ?? 0)}°C
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 3, md: 2, xl: 2 }} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        🌞 UV: {report?.clouds.all || currreport?.clouds.all}
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 3, md: 2, xl: 2 }} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        💧 Precipitation: {report?.main.sea_level || currreport?.main.sea_level} in
                                    </Grid>
                                </Grid>

                                <Typography variant="h6" sx={{ mb: 2 }}>Hourly Forecast</Typography>
                                <Box sx={{ display: "flex", overflowX: "auto", gap: 2, mb: 4, pb: 1 }}>
                                    {weather.hourly.slice(0, 12).map((h, i) => (
                                        <Paper
                                            key={i}
                                            elevation={5}
                                            sx={{
                                                minWidth: 80,
                                                p: 2,
                                                textAlign: "center",
                                                background: "rgba(255,255,255,0.15)",
                                                backdropFilter: "blur(6px)",
                                                borderRadius: 3,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: 1,
                                                color: "#fff",
                                            }}
                                        >
                                            {getWeatherIcon(h.weather[0].description.toLowerCase())}
                                            <Typography variant="body2">{new Date(h.dt * 1000).getHours()}:00</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {Math.round(h.main.temp)}°C
                                            </Typography>
                                        </Paper>
                                    ))}
                                </Box>

                                {/* Daily Forecast */}
                                <Typography variant="h6" sx={{ mb: 2 }}>Daily Forecast</Typography>
                                {weather.daily.slice(0, 5).map((d, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            py: 1,
                                            borderBottom: "1px solid rgba(255,255,255,0.2)",
                                        }}
                                    >
                                        <Typography>{new Date(d.dt * 1000).toLocaleDateString()}</Typography>
                                        <Typography>{Math.round(d.main.temp)}°C</Typography>
                                    </Box>
                                ))}
                            </>
                        )}
                    </CardContent>
                </Box>
            </Card>
        </Box>
    );
};

export default WeatherWidget;
