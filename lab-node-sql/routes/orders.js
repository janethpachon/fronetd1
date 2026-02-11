// routes/orders.js
const express = require("express");
const ordersController = require("../controllers/ordersController");

const router = express.Router();

// POST /api/orders - Crear orden
router.post("/", ordersController.createOrder);

// GET /api/orders/user/:userId - Obtener órdenes del usuario
router.get("/user/:userId", ordersController.getUserOrders);

// GET /api/orders/:orderId - Obtener orden por ID
router.get("/:orderId", ordersController.getOrderById);

// GET /api/orders/all (admin)
router.get("/", ordersController.getAllOrders);

// GET /api/orders/download/:userId/:productId
router.get("/download/:userId/:productId", ordersController.downloadProduct);

module.exports = router;
