import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BookshelfService } from '../bookshelf.service';
import { Book } from 'src/app/shared/book/book.model';
import { HttpService } from 'src/app/shared/http/http.service';

@Component({
  selector: 'app-bookshelf-editor',
  templateUrl: './bookshelf-editor.component.html',
  styleUrls: ['./bookshelf-editor.component.css'],
})
export class BookshelfEditorComponent implements OnInit {
  id: number;
  isEditMode = false;
  bookDetails: any = {
    title: '',
    author: '',
    genre: '',
    coverImagePath: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookshelfService: BookshelfService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.isEditMode = params['id'] != null;

      // If we are in "edit mode" => set the initial values for "bookDetails"
      if (this.isEditMode) {
        this.bookDetails = this.bookshelfService.getBookById(this.id);
      }
    });
  }

  onFormSubmit(formObj: NgForm) {
    // 1. Destructure book properties from the formObj
    const { title, author, genre, coverImagePath } = formObj.value;

    // 2. Set local bookDetails to formObj values
    this.bookDetails = new Book(title, author, genre, coverImagePath);

    // 3. Conditional statement to call different methods/functions depending on what "mode" we are in
    if (this.isEditMode) {
      // Edit the book
      let updatedBook = this.bookDetails;
      updatedBook.id = this.id;

      // get index of the book
      let idx = this.bookshelfService
        .getBooks()
        .findIndex((book) => book.id === this.id);

      // send a request to update the book
      this.httpService.updateBook(updatedBook).subscribe((res: any) => {
        if (res.success) {
          console.log('UPDATED BOOK SUCCESSFUL', res);
          // update the view
          this.bookshelfService.updateBook(idx, this.bookDetails);
        }
      });
    } else {
      // Create a new book
      this.httpService.saveBook(this.bookDetails);
    }

    // 4. Reset the form
    this.onFormReset();
  }

  onFormReset() {
    // Re-route to the root url of "/bookshelf"
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
