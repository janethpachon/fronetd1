// models/Product.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Product",
    {
      ProductID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ProductName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Description: {
        type: DataTypes.TEXT,
      },
      Price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      Technology: {
        type: DataTypes.STRING,
        comment: "e.g., React, Vue, Node.js, Java",
      },
      DifficultyLevel: {
        type: DataTypes.ENUM("beginner", "intermediate", "advanced"),
        defaultValue: "beginner",
      },
      CategoryID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      AdminID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      FileURL: {
        type: DataTypes.STRING,
        comment: "URL o ruta del archivo descargable",
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "products",
      timestamps: true,
    }
  );
};
