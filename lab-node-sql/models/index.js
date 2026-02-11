// models/index.js
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

// Conexión a MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME || "devmarket",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, // Cambiar a console.log para debug
  }
);

// Importar modelos
const User = require("./User")(sequelize);
const Category = require("./Category")(sequelize);
const Product = require("./Product")(sequelize);
const Cart = require("./Cart")(sequelize);
const Order = require("./Order")(sequelize);
const OrderItem = require("./OrderItem")(sequelize);

// Definir relaciones
// User 1:N Cart
User.hasMany(Cart, { foreignKey: "UserID", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "UserID" });

// User 1:N Order
User.hasMany(Order, { foreignKey: "UserID", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "UserID" });

// User 1:N Product (administrador)
User.hasMany(Product, { foreignKey: "AdminID", onDelete: "SET NULL" });
Product.belongsTo(User, { foreignKey: "AdminID", as: "admin" });

// Category 1:N Product
Category.hasMany(Product, { foreignKey: "CategoryID", onDelete: "CASCADE" });
Product.belongsTo(Category, { foreignKey: "CategoryID" });

// Product N:N Cart
Cart.belongsTo(Product, { foreignKey: "ProductID" });
Product.hasMany(Cart, { foreignKey: "ProductID" });

// Order 1:N OrderItem
Order.hasMany(OrderItem, { foreignKey: "OrderID", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "OrderID" });

// Product N:N Order (a través de OrderItem)
OrderItem.belongsTo(Product, { foreignKey: "ProductID" });
Product.hasMany(OrderItem, { foreignKey: "ProductID" });

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Cart,
  Order,
  OrderItem,
};
 
 