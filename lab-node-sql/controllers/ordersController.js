// controllers/ordersController.js
const { Order, OrderItem, Cart, Product, User } = require("../models");
const { sequelize } = require("../models");

// Crear orden desde el carrito
exports.createOrder = async (req, res) => {
  try {
    const { UserID } = req.body;

    if (!UserID) {
      return res.status(400).json({ error: "UserID es requerido" });
    }

    // Obtener items del carrito
    const cartItems = await Cart.findAll({
      where: { UserID },
      include: [
        {
          model: Product,
          attributes: ["ProductID", "Price"],
        },
      ],
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    // Calcular total
    let totalAmount = 0;
    cartItems.forEach((item) => {
      totalAmount += item.Product.Price * item.Quantity;
    });

    // Crear la orden
    const newOrder = await Order.create({
      UserID,
      TotalAmount: totalAmount,
      Status: "completed", // Auto completar para esta versión
    });

    // Crear los items de la orden
    for (const cartItem of cartItems) {
      await OrderItem.create({
        OrderID: newOrder.OrderID,
        ProductID: cartItem.ProductID,
        Price: cartItem.Product.Price,
      });
    }

    // Limpiar el carrito
    await Cart.destroy({ where: { UserID } });

    res.status(201).json({
      message: "Orden creada exitosamente",
      order: {
        ...newOrder.toJSON(),
        items: cartItems.map((c) => ({
          ProductID: c.ProductID,
          Quantity: c.Quantity,
          Price: c.Product.Price,
        })),
      },
    });
  } catch (error) {
    console.error("Error al crear orden:", error);
    res.status(500).json({ error: "Error al crear orden" });
  }
};

// Obtener órdenes del usuario
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.findAll({
      where: { UserID: userId },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["ProductID", "ProductName", "Price"],
            },
          ],
        },
      ],
      order: [["OrderDate", "DESC"]],
    });

    res.status(200).json({
      message: "Órdenes obtenidas",
      orders,
    });
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ error: "Error al obtener órdenes" });
  }
};

// Obtener orden por ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["ProductID", "ProductName", "Price", "FileURL"],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error al obtener orden:", error);
    res.status(500).json({ error: "Error al obtener orden" });
  }
};

// Obtener todas las órdenes (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ["UserID", "Email", "FullName"],
        },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["ProductID", "ProductName", "Price"],
            },
          ],
        },
      ],
      order: [["OrderDate", "DESC"]],
    });

    res.status(200).json({
      message: "Todas las órdenes",
      total: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ error: "Error al obtener órdenes" });
  }
};

// Descargar producto (verificar compra)
exports.downloadProduct = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Verificar si el usuario compró este producto
    const orderItem = await OrderItem.findOne({
      include: [
        {
          model: Order,
          where: { UserID: userId, Status: "completed" },
        },
        {
          model: Product,
          where: { ProductID: productId },
        },
      ],
    });

    if (!orderItem) {
      return res.status(403).json({ error: "No tienes acceso para descargar este producto" });
    }

    const product = await Product.findByPk(productId);

    res.status(200).json({
      message: "Usuario autorizado para descargar",
      downloadURL: product.FileURL || `/downloads/${productId}.zip`,
      product: {
        ProductID: product.ProductID,
        ProductName: product.ProductName,
      },
    });
  } catch (error) {
    console.error("Error al descargar producto:", error);
    res.status(500).json({ error: "Error al descargar producto" });
  }
};
