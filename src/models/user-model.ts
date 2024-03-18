import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../database/sequelize";
import Book from "./book-model";
import BorrowedBook from "./borrowed-book-model";

class User extends Model {
  public id!: number;
  public username!: string;
  public name!: string;
  public surname!: string;
  public password!: string;
  public email!: string;
  public isAdmin!: boolean;
  public recordDate!: Date;
  public updateDate!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    recordDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updateDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "User",
    timestamps: false,
  }
);

User.hasMany(BorrowedBook, { foreignKey: "userId", as: "BorrowedBooks" }); // Define association with correct alias

export default User;
