import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));

const routes = [
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: localStorage.getItem("token") ? (
      <Navigate to="/home" replace />
    ) : (
      <Navigate to="/login" replace />
    ),
  },
  { path: "*", element: <Navigate to="/" replace /> },
];

export { routes };
