// routes/cart.js
const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

// POST /api/cart - Agregar al carrito
router.post("/", cartController.addToCart);

// GET /api/cart/:userId - Obtener carrito del usuario
router.get("/:userId", cartController.getCart);

// DELETE /api/cart/:cartId - Eliminar del carrito
router.delete("/:cartId", cartController.removeFromCart);

// DELETE /api/cart/clear/:userId - Vaciar carrito
router.delete("/clear/:userId", cartController.clearCart);

module.exports = router;
