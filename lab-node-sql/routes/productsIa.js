// routes/productsIa.js
const express = require("express");
const { askProductsIA, getProductRecommendations } = require("../controllers/productsIaController");

const router = express.Router();

// POST /api/products/ia/ask - Hacer pregunta a la IA
router.post("/ia/ask", askProductsIA);

// GET /api/products/ia/recommendations - Obtener recomendaciones
router.get("/ia/recommendations", getProductRecommendations);

module.exports = router;
