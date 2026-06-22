// src/router.jsx
import { createBrowserRouter, redirect } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/LogIn";
import Signup from "./pages/SignUp";
import Events from "./pages/Events";
import EventPay from "./pages/Pay";
import MyEvents from "./pages/MyEvents";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import Recintos from "./pages/Recintos";
import AdminPage from "./components/Admin/AdminPage";

const authLoader = () => {
  const token = localStorage.getItem("token");
  if (!token) return redirect("/");

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirado = payload.exp * 1000 < Date.now();
    if (expirado) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      return redirect("/");
    }
  } catch {
    return redirect("/");
  }

  return null;
};

export const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
  { path: "/eventos", Component: Events },
  { path: "/eventos/:id", Component: EventPay },
  { path: "/servicios", Component: Services },
  { path: "/recintos", Component: Recintos },
  { path: "/mis-eventos", Component: MyEvents, loader: authLoader },
  { path: "/profile", Component: Profile, loader: authLoader },
  { path: "/admin", Component: AdminPage, loader: authLoader },
]);