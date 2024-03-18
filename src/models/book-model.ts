import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../database/sequelize";
import BorrowedBook from "./borrowed-book-model";
import User from "./user-model";

class Book extends Model {
  public id!: number;
  public title!: string;
  public author!: string;
  public description!: string;
  public averageRating!: number;
  public recordDate!: Date;
  public updateDate!: Date;
  public image!: string;
  public bookCode!: string;
  public borrowable!: boolean;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    averageRating: {
      type: DataTypes.FLOAT,
      allowNull: true,
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
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bookCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    borrowable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Book",
    tableName: "Book",
    timestamps: false,
  }
);

export default Book;
