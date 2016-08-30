import { Component, OnInit, OnDestroy, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { BookService } from './books.service';
import * as _ from 'underscore';
import { PagerService } from '../services/pagination-service';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

@Component({
    selector: 'book-list',
    template: require('./book-list.component.html')
})

export class BookListComponent implements OnInit, OnDestroy{

    private books = [];

    private bookLoadError;

    // dummy array of items to be paged
    //private dummyItems = _.range(1, 151);
 
    // pager object
    pager: any = {};
 
    // paged items
    pagedItems: any[];

    constructor(private bookService: BookService, private pagerService: PagerService, overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal){
        overlay.defaultViewContainer = vcRef;
    }

    ngOnInit(){
        this.getBooks();
    }

    setPage(page: number) {

        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
 
        // get pager object from service
        this.pager = this.pagerService.getPager(this.books.length, page);
 
        // get current page of items
        this.pagedItems = this.books.slice(this.pager.startIndex, this.pager.endIndex + 1);

    }

    getBooks(){
        this.bookService.getBooks()
                                .subscribe( 
                                                result => { 
                                                    this.bookLoadError='';
                                                    this.books = result.books;

                                                    //this.levels = result.levels;
                                                },
                                                error => {
                                                    //console.log(error);
                                                    this.bookLoadError = error; 
                                                },
                                                () =>  { 
                                                    this.setPage(1);
                                                    console.log('Done Fetching Books'); 
                                                    }
                                            );
    }

    onClick() {

    //let overlay = this.overlay;//to supress typescript error
    //let vcRef = this.vcRef;//to supress typescript error

    this.modal.alert()
        .size('lg')
        .showClose(true)
        .title('A simple Alert style modal window')
        .body(`
            <h4>Alert is a classic (title/body/footer) 1 button modal window that 
            does not block.</h4>
            <b>Configuration:</b>
            <ul>
                <li>Non blocking (click anywhere outside to dismiss)</li>
                <li>Size large</li>
                <li>Dismissed with default keyboard key (ESC)</li>
                <li>Close wth button click</li>
                <li>HTML content</li>
            </ul>`)
        .open();
  }

    ngOnDestroy(){
        this.books = [];
    }

}