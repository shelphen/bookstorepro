import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookService } from './books.service';

@Component({
    selector: 'book-list',
    template: require('./book-list.component.html')
               ,
    pipes: []
})

export class BookListComponent implements OnInit, OnDestroy{

    private books;

    constructor(private bookService: BookService){}

    ngOnInit(){
        this.books = this.bookService.getBooks();
    }

    ngOnDestroy(){
        this.books = [];
    }

}