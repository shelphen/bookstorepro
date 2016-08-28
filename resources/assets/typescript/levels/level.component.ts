import { Component, OnInit, OnDestroy } from '@angular/core';
import { LevelService } from './level.service';
//import { BookListComponent } from './book-list.component';
import {  } from './level-add.component';

@Component({
    selector: 'level',
    template: `
                <div style="margin-top:5%">
                    <router-outlet></router-outlet>
                </div>
                
                `
})

export class LevelComponent implements OnInit, OnDestroy{

    ngOnInit(){}

    ngOnDestroy(){}

}