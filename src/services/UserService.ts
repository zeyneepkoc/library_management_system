import { ResponseCodes } from "../enums/ResponseCodes";
import Book from "../models/book-model";
import BorrowedBook from "../models/borrowed-book-model";
import ResponseMessage from "../models/response-message";
import User from "../models/user-model";
import bcrypt from "bcrypt";

export class UserService {
  static async getAllUsers() {
    let response: ResponseMessage;
    try {
      const users = await User.findAll({
        attributes: [
          ["id", "UserId"],
          ["username", "UserName"],
          ["email", "Email"],
          ["name", "FirstName"],
          ["surname", "LastName"],
          ["recordDate", "RegistrationDate"],
        ],
      });
      response = {
        Code: ResponseCodes.Success,
        Data: users,
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

  static async createUser(
    username: string,
    name: string,
    surname: string,
    password: string,
    email: string,
    isAdmin: boolean
  ) {
    let response: ResponseMessage;
    try {
      // Check if the username already exists
      const existingUsername = await User.findOne({ where: { username } });
      password = await bcrypt.hash(password, 10);

      if (existingUsername) {
        response = {
          Code: ResponseCodes.Failed,
          Message: "Username already exists",
        };
        return response;
      }

      // Check if the email already exists
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        response = {
          Code: ResponseCodes.Failed,
          Message: "Email already exists",
        };
        return response;
      }

      const newUser = await User.create({
        username,
        name,
        surname,
        password,
        email,
        isAdmin,
      });

      if (newUser != null) {
        response = {
          Code: ResponseCodes.Success,
          Message: "User create success",
        };
        return response;
      } else {
        response = {
          Code: ResponseCodes.Failed,
          Message: "User create failed",
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

  static async getUserById(userId: number) {
    let response: ResponseMessage;
    try {
      const user = await User.findByPk(userId, {
        attributes: [
          ["id", "UserId"],
          ["username", "UserName"],
          ["email", "Email"],
          ["name", "FirstName"],
          ["surname", "LastName"],
          ["recordDate", "RegistrationDate"],
        ],
      });
      if (!user) {
        response = {
          Code: ResponseCodes.Failed,
          Data: "User not found",
        };
        return response;
      }
      response = {
        Code: ResponseCodes.Success,
        Data: user,
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

  static async getUserAllInfoById(userId: number) {
    let response: ResponseMessage;
    try {
      // const user = await User.findByPk(userId, {
      //   include: [
      //     {
      //       model: BorrowedBook as "borrowedBooks",
      //       include: [{ model: Book as "book" }],
      //     },
      //   ],
      // });

      const user = await User.findByPk(userId, {
        include: [
          {
            model: BorrowedBook,
            as: "BorrowedBooks",
            include: [
              {
                model: Book,
                as: "Book",
                attributes: [
                  ["id", "BookId"],
                  ["title", "Title"],
                  ["author", "Author"],
                  ["description", "Description"],
                  ["averageRating", "AverageRating"],
                  ["bookCode", "BookCode"],
                  ["borrowable", "Borrowable"],
                ],
              },
            ],
            attributes: [
              ["id", "BorrowedBookId"],
              ["borrowedDate", "BorrowedDate"],
              ["returnDate", "ReturnDate"],
              ["rating", "Rating"],
              ["notes", "Notes"],
            ],
          },
        ],
        attributes: [
          ["id", "UserId"],
          ["username", "UserName"],
          ["email", "Email"],
          ["name", "FirstName"],
          ["surname", "LastName"],
          ["recordDate", "RegistrationDate"],
        ],
      });
      if (!user) {
        response = {
          Code: ResponseCodes.Failed,
          Data: "User not found",
        };
        return response;
      }
      response = {
        Code: ResponseCodes.Success,
        Data: user,
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
}
