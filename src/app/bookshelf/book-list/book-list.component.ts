import { Book } from './../../shared/book/book.model';
import { BookshelfService } from './../bookshelf.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/shared/http/http.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent implements OnInit, OnDestroy {
  private bookListSub: Subscription;
  @Input() book: Book;
  myBooks: Book[] = [];
  sortField = 'author';
  sortSwitcher = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bookshelfService: BookshelfService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    // Use the Service to set the local "myBooks" array to the Service/Glboal "myBooks" array
    this.myBooks = this.bookshelfService.getBooks();

    // Listen for changes on the global "myBooks" arary and update the local version
    this.bookListSub = this.bookshelfService.bookListChanged.subscribe(
      (books: Book[]) => {
        this.myBooks = books;
      }
    );
  }

  ngOnDestroy() {
    this.bookListSub.unsubscribe();
  }

  onSort() {
    this.sortSwitcher = !this.sortSwitcher;

    if (this.sortSwitcher) {
      this.sortField = 'author';
    } else {
      this.sortField = 'title';
    }
  }

  onRemoveBook(id: number) {
    // send request to api
    this.httpService.deleteBook(id).subscribe((res: any) => {
      console.log('REMOVED BOOK', res);
      if (res.success) {
        // adjust view
        this.bookshelfService.removeBook(id);
      }
    });
  }

  onNewBook() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
