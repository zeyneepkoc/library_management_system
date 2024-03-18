import { Request, Response } from "express";
import { BookService } from "../services/BookService";

export class BookController {
  static async getAllBooks(req: Request, res: Response) {
    try {
      const books = await BookService.getAllBooks();
      return res.send(books);
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  }

  static async getBookById(req: Request, res: Response) {
    try {
      const bookId = parseInt(req.params.bookId); // Assuming book id is passed as a route parameter
      const book = await BookService.getBookById(bookId);
      return res.send(book);
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  }

  static async createBook(req: Request, res: Response) {
    try {
      const {
        title,
        author,
        description,
        image,
        bookCode,
        borrowable,
      } = req.body;
      const newBook = await BookService.createBook(
        title,
        author,
        description,
        image,
        bookCode,
        borrowable
      );
      return res.send(newBook);
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  }

  static async borrowBook(req: Request, res: Response) {
    try {
      const bookId = parseInt(req.params.bookId);
      const userId = parseInt(req.params.userId);
      const borrowedBook = await BookService.borrowBook(bookId, userId);
      return res.send(borrowedBook);
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  }

  static async returnBook(req: Request, res: Response) {
    try {
      const borrowedBookId = parseInt(req.params.borrowedBookId);
      const body = req.body;
      const returnedBook = await BookService.returnBook(borrowedBookId, body);
      return res.send(returnedBook);
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  }

  static async rateBook(req: Request, res: Response) {
    try {
      const borrowedBookId = parseInt(req.params.borrowedBookId);
      const rating = parseInt(req.body.rating);
      const ratedBook = await BookService.rateBook(borrowedBookId, rating);
      return res.send(ratedBook);
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  }

  static async updateBook(req: Request, res: Response) {
    try {
      const bookId = parseInt(req.params.bookId);
      const {
        title,
        author,
        description,
        image,
        bookCode,
        borrowable,
      } = req.body;
      const updateBook = await BookService.updateBook(
        bookId,
        title,
        author,
        description,
        image,
        bookCode,
        borrowable
      );
      return res.send(updateBook);
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  }
}
