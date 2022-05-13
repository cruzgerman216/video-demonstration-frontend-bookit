import { BookshelfService } from './../bookshelf.service';
import { Book } from './../../shared/book/book.model';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
})
export class BookDetailsComponent implements OnInit {
  book: Book;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookshelfService: BookshelfService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.book = this.bookshelfService.getBookById(this.id);
    });
  }

  onEditBook() {
    this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route });
  }

  onRemoveBook() {
    this.bookshelfService.removeBook(this.id);
  }
}
