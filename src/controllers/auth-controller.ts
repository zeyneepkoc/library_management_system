import { Request, Response, response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  static async signup(req: Request, res: Response) {} // user/createUser()
  static async signin(req: Request, res: Response) {
    try {
      const { usernameOrEmail, password } = req.body;
      const loggedInUser = await AuthService.signin(usernameOrEmail, password);
      return res.send(loggedInUser);
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  }
}
