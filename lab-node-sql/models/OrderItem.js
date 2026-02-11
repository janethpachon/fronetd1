// models/OrderItem.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "OrderItem",
    {
      OrderItemID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      OrderID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ProductID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "order_items",
      timestamps: false,
    }
  );
};
