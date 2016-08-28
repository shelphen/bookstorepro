import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoryService } from './category.service';
//import { BookListComponent } from './book-list.component';
import { CategoryAddComponent } from './category-add.component';

@Component({
    selector: 'category',
    template: `
                <div style="margin-top:5%">
                    <router-outlet></router-outlet>
                </div>
                
                `
})

export class CategoryComponent implements OnInit, OnDestroy{

    ngOnInit(){}

    ngOnDestroy(){}

}