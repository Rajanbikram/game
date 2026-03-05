import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  "game",
  "postgres",
  "Rajanbikram@123",
  {
    host: "localhost",
    dialect: "postgres",
    logging: true
  }
);

export const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

  await sequelize.sync({ alter: true });
    console.log("All tables synced successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};