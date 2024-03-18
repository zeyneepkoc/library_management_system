import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      return res.send(users);
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  }

  static async createUser(req: Request, res: Response) {
    const { username, name, surname, password, email, isAdmin } = req.body;
    try {
      const newUser = await UserService.createUser(
        username,
        name,
        surname,
        password,
        email,
        isAdmin
      );
      return res.send(newUser);
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const user = await UserService.getUserById(userId);
      return res.send(user);
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  }

  static async getUserAllInfoById(req: Request, res: Response) {
    const userId = parseInt(req.params.userId);
    try {
      const userInfo = await UserService.getUserAllInfoById(userId);
      res.send(userInfo);
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  }
}
