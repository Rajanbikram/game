import { DataTypes } from "sequelize";
import { sequelize } from "../../database/db.js";
import Order from "./Order.js";

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Order,
      key: "id",
    },
  },
  method: {
    type: DataTypes.ENUM("card", "esewa", "cod"),
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "completed", "failed"),
    defaultValue: "pending",
  },
});

Payment.belongsTo(Order, { foreignKey: "orderId" });
Order.hasOne(Payment, { foreignKey: "orderId" });

export default Payment;