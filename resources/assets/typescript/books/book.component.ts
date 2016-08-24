import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookService } from './books.service';
import { BookListComponent } from './book-list.component';
import { BookAddComponent } from './book-add.component';

@Component({
    selector: 'book',
    template: `
                <div style="margin-top:5%">
                    <router-outlet></router-outlet>
                </div>
                
                `
})

export class BookComponent implements OnInit, OnDestroy{

    ngOnInit(){
        //
    }

    ngOnDestroy(){
        //
    }

}