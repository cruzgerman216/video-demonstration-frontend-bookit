import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookshelfService } from '../../bookshelf/bookshelf.service';
import { Book } from '../book/book.model';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HttpService {
  // * VARIABLES * \\
  firebaseRootURL =
    'https://cape-book-app-default-rtdb.firebaseio.com/books.json';

  // * INJECTIONS * \\
  constructor(
    private http: HttpClient,
    private bookshelfService: BookshelfService
  ) {}

  // * METHODS * \\
  //   Save books to Firebase DB
  saveBooksToFirebase() {
    const books = this.bookshelfService.getBooks();

    this.http.put(this.firebaseRootURL, books).subscribe((res) => {
      console.log('Firebase DB Response:', res);
    });
  }

  // Fetch books from Firebase DB
  fetchBooks() {
    return this.http.get("https://paducah-bookit-api.herokuapp.com/api/v1/books/my_books").pipe(
      tap((res:any) => {
        this.bookshelfService.setBooks(res.payload);
      })
    );
  }
}
