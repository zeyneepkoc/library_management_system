import express from "express";
import userRoute from "../routes/user-route";
import bookRoute from "../routes/book-route";
import authRoute from "../routes/auth-route";

const router = express.Router();
router.use("/UserController", userRoute);
router.use("/BookController", bookRoute);
router.use("/AuthController", authRoute);
export default router;
