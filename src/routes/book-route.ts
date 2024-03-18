import express from "express";
import { BookController } from "../controllers/book-controller";
import authorize from "../middleware/authenticate";
import { Role } from "../enums/Role";

const router = express.Router();

router.get("/books", authorize(), BookController.getAllBooks);
router.get("/books/:bookId", authorize(), BookController.getBookById);
router.post("/books", authorize(Role.ADMIN), BookController.createBook);
router.get(
  "/books/:bookId/borrow/:userId",
  authorize(),
  BookController.borrowBook
);
router.post(
  "/books/return/:borrowedBookId",
  authorize(),
  BookController.returnBook
);
router.post(
  "/books/rate/:borrowedBookId",
  authorize(),
  BookController.rateBook
);
router.post("/books/update/:bookId", authorize(Role.ADMIN), BookController.updateBook);
export default router;
