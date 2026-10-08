import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
// database connection

dotenv.config();
// const databaseUrl = process.env.DATABASE_URL;
// if (!databaseUrl) {
//   throw new Error("DATABASE_URL is required");
// }

// const dbName = process.env.PGDATABASE;
// const dbUsername = process.env.PGUSER;
// const dbPassword = process.env.PGPASSWORD;
// const dbURL = process.env.PGHOST_UNPOOLED;
// const PORT = process.env.PORT;
// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: "postgres",
//   logging: false,
// });
const sequelize = new Sequelize("product_db", "dev_user", "dev_password", {
  host: "postgres-db",
  port: 5432,
  dialect: "postgres",
  logging: false,
  //   dialectOptions: {
  //     ssl: { require: true, rejectUnauthorized: false },
  //   },
});

// const sequelize = new Sequelize(databaseUrl, {
//   dialect: "postgres-db",
//   logging: false,
//   dialectOptions: {
//     ssl: { require: true, rejectUnauthorized: false },
//   },
// });

// define database schema
const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL!!");
    await sequelize.sync({ alter: true });
    console.log("Table syncronize !");
  } catch (error) {
    console.error("Connection failed", error);
    process.exit(1);
  }
};
export { sequelize, Product, connectDB };
