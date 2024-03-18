import express from "express";
import { UserController } from "../controllers/user-controller";
import authorize from "../middleware/authenticate";
import { Role } from "../enums/Role";

const router = express.Router();

router.get("/users", authorize(), UserController.getAllUsers);
router.post("/users", authorize(), UserController.createUser);
router.get("/users/:userId", authorize(), UserController.getUserById);
router.get(
  "/users/:userId/allInfo",
  authorize(),
  UserController.getUserAllInfoById
);
export default router;
