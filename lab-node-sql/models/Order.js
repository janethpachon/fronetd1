// models/Order.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Order",
    {
      OrderID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      OrderDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      TotalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      Status: {
        type: DataTypes.ENUM("pending", "completed", "cancelled"),
        defaultValue: "pending",
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "orders",
      timestamps: false,
    }
  );
};
