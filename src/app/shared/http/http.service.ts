import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookshelfService } from '../../bookshelf/bookshelf.service';
import { Book } from '../book/book.model';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HttpService {
  constructor(
    private http: HttpClient,
    private bookshelfService: BookshelfService
  ) {}

  saveBook(book) {
    this.http
      .post('https://paducah-bookit-api.herokuapp.com/api/v1/books', book)
      .subscribe((res: any) => {
        console.log('Firebase DB Response:', res);
        // Update the view
        if (res.success) {
          this.bookshelfService.saveBook(res.payload.book);
        }
      });
  }

  fetchBooks() {
    return this.http
      .get('https://paducah-bookit-api.herokuapp.com/api/v1/books/my_books')
      .pipe(
        tap((res: any) => {
          this.bookshelfService.setBooks(res.payload);
        })
      );
  }

  deleteBook(id:number){
    return this.http.delete(`https://paducah-bookit-api.herokuapp.com/api/v1/books/${id}`)
  }
  updateBook(book){
    return this.http.put(`https://paducah-bookit-api.herokuapp.com/api/v1/books/${book.id}`, book)
  }
}
