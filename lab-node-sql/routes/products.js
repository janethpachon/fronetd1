// routes/products.js
const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getTechnologies,
} = require("../controllers/productsController");

const router = express.Router();

// GET /api/products - Obtener todos con filtros - HU-02
router.get("/", getAllProducts);

// GET /api/products/categories - Obtener categorías
router.get("/categories/all", getCategories);

// GET /api/products/technologies - Obtener tecnologías
router.get("/technologies/all", getTechnologies);

// GET /api/products/:id - Obtener por ID - HU-02
router.get("/:id", getProductById);

// POST /api/products - Crear (admin)
router.post("/", createProduct);

// PUT /api/products/:id - Actualizar (admin)
router.put("/:id", updateProduct);

// DELETE /api/products/:id - Eliminar (admin)router.delete("/:id", deleteProduct);

module.exports = router;