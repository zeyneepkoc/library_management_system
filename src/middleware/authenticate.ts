import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../enums/Role";

require("dotenv").config();

const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({ Message: "Bearer token not found" });
    }

    const token = authorizationHeader.split(" ")[1];
    const secretKey = process.env.SECRETKEY;

    jwt.verify(token, secretKey!, (err: any, decoded: any) => {
      if (err) {
        console.error(err);
        return res.status(403).json({ Message: "Invalid token" });
      }

      const userRoles: Role[] = decoded.roles;

      if (roles.length === 0 || userRoles.length === 0) {
        return next();
      }

      const isAuthorized = roles.some((role) => userRoles.includes(role));
      if (!isAuthorized) {
        return res.status(403).json({ Message: "Unauthorized" });
      }
      next();
    });
  };
};

export default authorize;
