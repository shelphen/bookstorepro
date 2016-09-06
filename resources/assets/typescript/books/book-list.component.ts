import { Component, OnInit, ViewChild, OnDestroy, ViewContainerRef, ViewEncapsulation, trigger, state, style, animate, transition } from '@angular/core';
import { BookService } from './books.service';
import * as _ from 'underscore';
import { PagerService } from '../services/pagination-service';
import { Overlay } from 'angular2-modal';
//import { Modal } from 'angular2-modal/plugins/bootstrap';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';
import {SlimLoadingBarService, SlimLoadingBarComponent} from 'ng2-slim-loading-bar';
import { NotificationService } from '../services/notification/notification.service';

@Component({
    selector: 'book-list',
    template: require('./book-list.component.html'),
     animations: [
        trigger('flyInOut', [
            state('in', style({ opacity: 1, transform: 'translateX(0)' })),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(-100%)'
                }),
                animate('0.6s ease-in')
            ]),
            transition('* => void', [
                animate('0.2s 10 ease-out', style({
                    opacity: 0,
                    transform: 'translateX(100%)'
                }))
            ])
        ])
    ]
})

export class BookListComponent implements OnInit, OnDestroy{

    private books = [];

    private bookLoadError;
 
    pager: any = {};// pager object
 
    pagedItems: any[];// paged items

    private actionValue:any[] =[];

    private itemPerPage = 5;

    private selectedBookId;

    @ViewChild('modal1') modal1: ModalComponent;

    @ViewChild('modal2') modal2: ModalComponent;

    constructor(
                private bookService: BookService, 
                private pagerService: PagerService, 
                overlay: Overlay, 
                vcRef: ViewContainerRef, 
                private router: Router, 
                private slimLoadingBarService:SlimLoadingBarService,
                private notificationService: NotificationService){ overlay.defaultViewContainer = vcRef; }

    ngOnInit(){
        this.getBooks();
    }

    setPage(page: number) {
        console.log('Items Per Page : ', this.itemPerPage);
        if (page < 1 || page > this.pager.totalPages) return;
 
        this.pager = this.pagerService.getPager(this.books.length, page, this.itemPerPage);//get pager object from service
 
        this.pagedItems = this.books.slice(this.pager.startIndex, this.pager.endIndex + 1);//get current page of items

    }

    setItemPerPage(){
        this.setPage(1);
    }

    getBooks(){
        
        this.bookService.getBooks()
                                .subscribe( 
                                                result => { 
                                                    this.bookLoadError='';
                                                    this.books = result.books;
                                                },
                                                error => {
                                                    this.bookLoadError = error; 
                                                },
                                                () =>  { 
                                                    this.setPage(1);
                                                    console.log('Done Fetching Books'); 
                                                    }
                                            );
    }

  open(bookId) {
        if(!this.actionValue[bookId]) return;
        this.selectedBookId = bookId;
        if(this.actionValue[bookId]=='delete') this.modal1.open('lg');
        if(this.actionValue[bookId]=='edit') this.modal2.open('lg');
    }

    removeBook(){
        this.bookService.removeBook(this.selectedBookId)
                                .subscribe( 
                                                result => { 
                                                    console.log(result);
                                                    //this.catLoadError = '';
                                                    //this.catRemoveSuccess=result.success;
                                                },
                                                error => {
                                                    console.log(error);
                                                    //this.catLoadError = error;
                                                },
                                                () =>  { 
                                                    console.log('Done Deleting Book'); 
                                                    this.getBooks();
                                                    }
                                            );
    }

    editBook(){

        let selBookId = this.selectedBookId;
        let dis = this;
        _.each(this.books, function( book: any ) { 
            if( book.id === selBookId ) dis.bookService.setBookEditDetails(book);
        }, selBookId);

        let route = '/books/add/' + this.selectedBookId;
        this.router.navigate([ route ]); 
    }

    startLoading() {
        this.notificationService.printErrorMessage('Loading...');
        // We can listen when loading will be completed 
        //this.slimLoadingBarService.start(() => {
            //console.log('Loading complete');
        //});
        this.slimLoadingBarService.start();
        setTimeout(() => {
            this.slimLoadingBarService.complete();
            this.notificationService.printSuccessMessage('Loading Complete...');
        }, 5000);
    }

    ngOnDestroy(){
        this.books = [];
    }

}