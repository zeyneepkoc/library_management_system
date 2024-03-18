import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../database/sequelize";
import User from "./user-model";
import Book from "./book-model";

class BorrowedBook extends Model {
  public id!: number;
  public userId!: number;
  public bookId!: number;
  public borrowedDate!: Date;
  public returnDate!: Date | null;
  public rating!: number | null;
  public notes!: string | null;
  public recordDate!: Date;
  public updateDate!: Date;
}

BorrowedBook.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    borrowedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
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
  },
  {
    sequelize,
    modelName: "BorrowedBook",
    tableName: "BorrowedBook",
    timestamps: false,
  }
);

BorrowedBook.belongsTo(Book, { foreignKey: "bookId", as: "Book" }); // Define the association

export default BorrowedBook;
