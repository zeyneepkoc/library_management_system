import { Op } from "sequelize";
import User from "../models/user-model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResponseCodes } from "../enums/ResponseCodes";
import ResponseMessage from "../models/response-message";
import { Role } from "../enums/Role";
require("dotenv").config();

export class AuthService {
  static async signin(usernameOrEmail: string, password: string) {
    let response: ResponseMessage;
    try {
      const loggedInUser = await User.findOne({
        where: {
          [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        },
      });

      if (!loggedInUser) {
        response = {
          Code: ResponseCodes.Failed,
          Message: "Username or email not found",
        };
        return response;
      }

      const isPasswordMatch = await this.comparePassword(
        password,
        loggedInUser.password
      );

      if (!isPasswordMatch) {
        response = {
          Code: ResponseCodes.Failed,
          Message: "Incorrect password",
        };
        return response;
      }

      const roles = [Role.USER];
      if (loggedInUser.isAdmin) {
        roles.push(Role.ADMIN);
      }

      const token = jwt.sign(
        { userId: loggedInUser.id, roles },
        process.env.SECRETKEY!,
        {
          expiresIn: "2h",
        }
      );
      response = {
        Code: ResponseCodes.Success,
        Message: "Signin successfully",
        Data: token,
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

  static async comparePassword(
    userPassword: string,
    password: string
  ): Promise<boolean> {
    return bcrypt.compare(userPassword, password);
  }
}
