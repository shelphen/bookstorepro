import { Component, OnInit, OnDestroy, ViewContainerRef, ViewEncapsulation, trigger, state, style, animate, transition } from '@angular/core';
import { BookService } from './books.service';
import * as _ from 'underscore';
import { PagerService } from '../services/pagination-service';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

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

    constructor(private bookService: BookService, private pagerService: PagerService, overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal){
        overlay.defaultViewContainer = vcRef;
    }

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

    onClick(bookId) {

        if(!this.actionValue[bookId]) return;

        if(this.actionValue[bookId] === 'edit'){

            let title = 'Do you want to edit the selected product ?';
            let body = ``;

            this.generateModalObject(title,body).open();

        }else if(this.actionValue[bookId] === 'delete'){

            let title = 'Do you want to delete the selected product ?';
            let body = ``;
            
            this.generateModalObject(title,body).open();

        }

        // this.modal.alert()
        //     .size('lg')
        //     .showClose(true)
        //     .title('A simple Alert style modal window')
        //     .body(`
        //         <h4>Alert is a classic (title/body/footer) 1 button modal window that 
        //         does not block.</h4>
        //         <b>Configuration:</b>
        //         <ul>
        //             <li>Non blocking (click anywhere outside to dismiss)</li>
        //             <li>Size large</li>
        //             <li>Dismissed with default keyboard key (ESC)</li>
        //             <li>Close wth button click</li>
        //             <li>HTML content</li>
        //         </ul>`)
        //     .open();
  }

  private generateModalObject(title: string, body: string, showClose:boolean = true, size: string = 'lg'){

       return this.modal.alert().size( size ).showClose( showClose ).title( title ).body( body );

  }

    ngOnDestroy(){
        this.books = [];
    }

}