import { Op } from "sequelize";
import Book from "../models/book-model";
import BorrowedBook from "../models/borrowed-book-model";
import User from "../models/user-model";
import ResponseMessage from "../models/response-message";
import { ResponseCodes } from "../enums/ResponseCodes";

export class BookService {
  static async getAllBooks() {
    let response: ResponseMessage;
    try {
      const books = await Book.findAll({
        attributes: [
          ["id", "BookId"],
          ["title", "Title"],
          ["author", "Author"],
          ["description", "Description"],
          ["averageRating", "AverageRating"],
          ["bookCode", "BookCode"],
          ["borrowable", "Borrowable"],
        ],
      });
      response = {
        Code: ResponseCodes.Success,
        Data: books,
      };
      return response;
    } catch (error) {
      response = {
        Code: ResponseCodes.Failed,
        Message: error?.toString(),
      };
      return response;
    }
  }

  static async getBookById(bookId: number) {
    let response: ResponseMessage;

    try {
      const book = await Book.findByPk(bookId, {
        attributes: [
          ["id", "BookId"],
          ["title", "Title"],
          ["author", "Author"],
          ["description", "Description"],
          ["averageRating", "AverageRating"],
          ["bookCode", "BookCode"],
          ["borrowable", "Borrowable"],
        ],
      });
      response = {
        Code: ResponseCodes.Success,
        Data: book,
      };
      return response;
    } catch (error) {
      response = {
        Code: ResponseCodes.Failed,
        Message: error?.toString(),
      };
      return response;
    }
  }

  static async createBook(
    title: string,
    author: string,
    description: string,
    image: string,
    bookCode: string,
    borrowable: boolean
  ) {
    let response: ResponseMessage;

    try {
      const newBook = await Book.create({
        title,
        author,
        description,
        image,
        bookCode,
        borrowable,
      });

      if (newBook != null) {
        response = {
          Code: ResponseCodes.Success,
          Message: "Book create success",
        };
        return response;
      } else {
        response = {
          Code: ResponseCodes.Failed,
          Message: "Book create failed",
        };
        return response;
      }
    } catch (error) {
      response = {
        Code: ResponseCodes.Failed,
        Message: error?.toString(),
      };
      return response;
    }
  }

  static async borrowBook(bookId: number, userId: number) {
    let response: ResponseMessage;
    try {
      // Check if the book exists
      const book = await Book.findByPk(bookId);
      if (!book) {
        response = {
          Code: ResponseCodes.Failed,
          Message: "Book not found",
        };
        return response;
      }

      if (!book.borrowable) {
        response = {
          Code: ResponseCodes.Failed,
          Message:
            "This book cannot be borrowed as its borrowable status is false",
        };
        return response;
      }

      // Check if the user exists
      const user = await User.findByPk(userId);
      if (!user) {
        response = {
          Code: ResponseCodes.Failed,
          Message: "User not found",
        };
        return response;
      }

      const borrowedBook = await BorrowedBook.create({
        userId,
        bookId,
        borrowedDate: new Date(),
        returnDate: null,
        rating: null,
        notes: null,
      });

      if (borrowedBook != null) {
        book.borrowable = false;
        await book.save();
        response = {
          Code: ResponseCodes.Success,
          Message: "Borrowed book create success",
        };
        return response;
      } else {
        response = {
          Code: ResponseCodes.Failed,
          Message: "Borrowed book create failed",
        };
        return response;
      }
    } catch (error) {
      response = {
        Code: ResponseCodes.Failed,
        Message: error?.toString(),
      };
      return response;
    }
  }

  static async returnBook(id: number, body: any) {
    let response: ResponseMessage;
    try {
      const borrowedBook = await BorrowedBook.findOne({
        where: {
          id,
          returnDate: null,
        },
      });

      if (!borrowedBook) {
        response = {
          Code: ResponseCodes.Failed,
          Message: "Borrowed book not found or already returned",
        };
        return response;
      }

      borrowedBook.returnDate = new Date();
      borrowedBook.rating = body.rating;
      borrowedBook.notes = body.notes;
      const book = await Book.findByPk(borrowedBook.bookId);
      if (!book) {
        response = {
          Code: ResponseCodes.Failed,
          Message: "Book not found",
        };
        return response;
      }
      book.borrowable = true;
      await borrowedBook.save();

      // Recalculate average rating
      const bookId = borrowedBook.bookId;
      if (!book) {
        response = {
          Code: ResponseCodes.Failed,
          Message: "Book not found",
        };
        return response;
      }

      const borrowedBooks = await BorrowedBook.findAll({
        where: {
          bookId,
          rating: { [Op.not]: null },
        },
      });

      let totalRating = 0;
      for (const iBorrowedBook of borrowedBooks) {
        totalRating += iBorrowedBook.rating!;
      }

      const averageRating = totalRating / borrowedBooks.length;
      book.averageRating = averageRating;

      await book.save();
      response = {
        Code: ResponseCodes.Success,
        Message: "Borrowed book return success",
      };
      return response;
    } catch (error) {
      response = {
        Code: ResponseCodes.Failed,
        Message: error?.toString(),
      };
      return response;
    }
  }

  static async rateBook(id: number, rating: number) {
    let response: ResponseMessage;

    try {
      const borrowedBook = await BorrowedBook.findOne({
        where: {
          id,
          returnDate: { [Op.not]: null },
          rating: null,
        },
      });

      if (!borrowedBook) {
        response = {
          Code: ResponseCodes.Failed,
          Message:
            "Borrowed book not found, not returned yet, or already rated",
        };
        return response;
      }

      // Update the rating
      borrowedBook.rating = rating;
      await borrowedBook.save();

      // Recalculate average rating
      const bookId = borrowedBook.bookId;
      const book = await Book.findByPk(bookId);
      if (!book) {
        response = {
          Code: ResponseCodes.Failed,
          Message: "Book not found",
        };
        return response;
      }

      const borrowedBooks = await BorrowedBook.findAll({
        where: {
          bookId,
          rating: { [Op.not]: null },
        },
      });

      let totalRating = 0;
      for (const borrowedBook of borrowedBooks) {
        totalRating += borrowedBook.rating!;
      }

      const averageRating = totalRating / borrowedBooks.length;
      book.averageRating = averageRating;
      await book.save();

      response = {
        Code: ResponseCodes.Success,
        Message: "Borrowed book rating success",
      };
      return response;
    } catch (error) {
      response = {
        Code: ResponseCodes.Failed,
        Message: error?.toString(),
      };
      return response;
    }
  }

  static async updateBook(
    bookId: number,
    title: string,
    author: string,
    description: string,
    image: string,
    bookCode: string,
    borrowable: boolean
  ) {
    let response: ResponseMessage;

    try {
      const bookToUpdate = await Book.findOne({ where: { id: bookId } });

      if (bookToUpdate) {
        await bookToUpdate.update({
          title,
          author,
          description,
          image,
          bookCode,
          borrowable,
        });

        response = {
          Code: ResponseCodes.Success,
          Message: "Book update success",
        };
      } else {
        response = {
          Code: ResponseCodes.Failed,
          Message: "Book not found",
        };
      }
    } catch (error) {
      response = {
        Code: ResponseCodes.Failed,
        Message: error?.toString(),
      };
    }

    return response;
  }
}
