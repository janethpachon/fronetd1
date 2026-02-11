// controllers/productsController.js
const { Product, Category } = require("../models");
const { Op } = require("sequelize");

// Obtener todos los productos con filtros - HU-02
exports.getAllProducts = async (req, res) => {
  try {
    const { categoryId, technology, difficulty } = req.query;

    let where = {};

    if (categoryId) where.CategoryID = categoryId;
    if (technology) where.Technology = technology;
    if (difficulty) where.DifficultyLevel = difficulty;

    const products = await Product.findAll({
      where,
      include: [
        {
          model: Category,
          attributes: ["CategoryID", "CategoryName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Productos obtenidos exitosamente",
      total: products.length,
      products,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

// Obtener producto por ID - HU-02
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ["CategoryID", "CategoryName"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

// Crear producto - Solo admin
exports.createProduct = async (req, res) => {
  try {
    const { ProductName, Description, Price, Technology, DifficultyLevel, CategoryID, AdminID, FileURL } = req.body;

    if (!ProductName || !Price || !CategoryID || !AdminID) {
      return res.status(400).json({ error: "Campos requeridos faltantes" });
    }

    const newProduct = await Product.create({
      ProductName,
      Description,
      Price,
      Technology,
      DifficultyLevel,
      CategoryID,
      AdminID,
      FileURL,
    });

    res.status(201).json({
      message: "Producto creado exitosamente",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

// Actualizar producto - Solo admin
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { ProductName, Description, Price, Technology, DifficultyLevel, CategoryID, FileURL } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await product.update({
      ProductName: ProductName || product.ProductName,
      Description: Description || product.Description,
      Price: Price || product.Price,
      Technology: Technology || product.Technology,
      DifficultyLevel: DifficultyLevel || product.DifficultyLevel,
      CategoryID: CategoryID || product.CategoryID,
      FileURL: FileURL || product.FileURL,
    });

    res.status(200).json({
      message: "Producto actualizado exitosamente",
      product,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

// Eliminar producto - Solo admin
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await product.destroy();

    res.status(200).json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

// Obtener categorías únicas
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["CategoryName", "ASC"]],
    });

    res.status(200).json({
      message: "Categorías obtenidas",
      categories,
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
};

// Obtener tecnologías únicas
exports.getTechnologies = async (req, res) => {
  try {
    const technologies = await Product.findAll({
      attributes: [[require("sequelize").fn("DISTINCT", require("sequelize").col("Technology")), "Technology"]],
      raw: true,
      order: [["Technology", "ASC"]],
    });

    const techList = technologies.map((t) => t.Technology).filter(Boolean);

    res.status(200).json({
      message: "Tecnologías obtenidas",
      technologies: techList,
    });
  } catch (error) {
    console.error("Error al obtener tecnologías:", error);
    res.status(500).json({ error: "Error al obtener tecnologías" });
  }
};
