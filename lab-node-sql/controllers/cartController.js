// controllers/cartController.js
const { Cart, Product, User } = require("../models");

// Agregar producto al carrito - HU-02
exports.addToCart = async (req, res) => {
  try {
    const { UserID, ProductID, Quantity } = req.body;

    if (!UserID || !ProductID) {
      return res.status(400).json({ error: "UserID y ProductID son requeridos" });
    }

    // Verificar que el producto existe
    const product = await Product.findByPk(ProductID);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Ver si ya existe en el carrito
    let cartItem = await Cart.findOne({ where: { UserID, ProductID } });

    if (cartItem) {
      // Actualizar cantidad
      cartItem.Quantity += Quantity || 1;
      await cartItem.save();
    } else {
      // Crear nuevo item
      cartItem = await Cart.create({
        UserID,
        ProductID,
        Quantity: Quantity || 1,
      });
    }

    res.status(201).json({
      message: "Producto agregado al carrito",
      cartItem,
    });
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    res.status(500).json({ error: "Error al agregar al carrito" });
  }
};

// Obtener carrito del usuario
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cartItems = await Cart.findAll({
      where: { UserID: userId },
      include: [
        {
          model: Product,
          attributes: ["ProductID", "ProductName", "Price", "Technology"],
        },
      ],
    });

    let totalprice = 0;
    cartItems.forEach((item) => {
      totalprice += item.Product.Price * item.Quantity;
    });

    res.status(200).json({
      userId,
      items: cartItems,
      totalPrice: totalprice,
    });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ error: "Error al obtener carrito" });
  }
};

// Eliminar producto del carrito
exports.removeFromCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    const cartItem = await Cart.findByPk(cartId);

    if (!cartItem) {
      return res.status(404).json({ error: "Item del carrito no encontrado" });
    }

    await cartItem.destroy();

    res.status(200).json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    console.error("Error al eliminar del carrito:", error);
    res.status(500).json({ error: "Error al eliminar del carrito" });
  }
};

// Vaciar carrito
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    await Cart.destroy({ where: { UserID: userId } });

    res.status(200).json({ message: "Carrito vaciado exitosamente" });
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    res.status(500).json({ error: "Error al vaciar carrito" });
  }
};
