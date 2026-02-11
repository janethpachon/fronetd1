// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Cargar variables de entorno ANTES de requerir otros módulos.
// Usar path absoluto al .env dentro del directorio del proyecto para mayor fiabilidad
dotenv.config({ path: path.join(__dirname, '.env') });

const { sequelize } = require("./models");
const authRoutes = require("./routes/auth");
const productsRoutes = require("./routes/products");
const productsIaRoutes = require("./routes/productsIa");
const cartRoutes = require("./routes/cart");
const ordersRoutes = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(express.static("frontend"));

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/products", productsIaRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);

// Ruta raíz - sirve el registro/login
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/frontend/index.html");
});

// Inicio
async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL exitosa");

    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ alter: false });
    console.log("✅ Modelos sincronizados");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor DevMarket en http://localhost:${PORT}`);
      console.log(`📚 API: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error("❌ Error al iniciar servidor:", err);
    process.exit(1);
  }
}

start();
