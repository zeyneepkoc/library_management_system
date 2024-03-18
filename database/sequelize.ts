import { Sequelize } from "sequelize-typescript";

export const sequelize = new Sequelize({
  username: "postgres",
  password: "12345",
  database: "LibraryManagementSystem",
  host: "localhost",
  dialect: "postgres",
});
