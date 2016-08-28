import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookService } from './books.service';

@Component({
    selector: 'book-list',
    template: require('./book-list.component.html')
})

export class BookListComponent implements OnInit, OnDestroy{

    private books;

    private bookLoadError;

    constructor(private bookService: BookService){}

    ngOnInit(){
        this.getBooks();
    }

    getBooks(){
        this.bookService.getBooks()
                                .subscribe( 
                                                result => { 
                                                    console.log(result.books);
                                                    this.bookLoadError='';
                                                    this.books = result.books;

                                                    //this.levels = result.levels;
                                                },
                                                error => {
                                                    //console.log(error);
                                                    this.bookLoadError = error; 
                                                },
                                                () =>  { 
                                                    console.log('Done Fetching Books'); 
                                                    }
                                            );
    }

    ngOnDestroy(){
        this.books = [];
    }

}