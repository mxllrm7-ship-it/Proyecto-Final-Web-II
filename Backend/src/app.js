import "dotenv/config";
import express from "express";
import cors from "cors";

import usuarioRouter from "./routes/UsuarioRouter.js";
import authRouter from "./routes/authRouter.js";
import eventoRoutes from "./routes/eventoRouter.js";
import pagoRoutes from "./routes/pagoRoutes.js";
import ciudadRouter from "./routes/CiudadRouter.js";
import ticketUsuarioRoutes from "./routes/ticketUsuarioRoutes.js";
import catalogoRoutes from "./routes/catalogoRoutes.js";
import servicioRoutes from "./routes/servicioRoutes.js";
import recintoRoutes from "./routes/recintoRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import contratarServicioRoutes from "./routes/contratarServicioRoutes.js";
import contratarRecintoRoutes from "./routes/contratarRecintoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificacionRoutes from "./routes/notificacionRoutes.js";
import misReservasRoutes from "./routes/misReservasRoutes.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

app.use("/api/usuarios", usuarioRouter);
app.use("/api/auth", authRouter);
app.use("/api/eventos", eventoRoutes);
app.use("/api/ciudad", ciudadRouter);
app.use("/api/pagos", pagoRoutes);
app.use("/api/mis-eventos", ticketUsuarioRoutes);
app.use("/api/catalogo", catalogoRoutes);
app.use("/api/servicios", servicioRoutes);
app.use("/api/recintos", recintoRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/contratar-servicio", contratarServicioRoutes);
app.use("/api/contratar-recinto", contratarRecintoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notificaciones", notificacionRoutes);
app.use("/api/mis-reservas", misReservasRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    mensaje: "Servidor funcionando correctamente"
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});