import { Component, OnInit, OnDestroy } from '@angular/core';
import { LevelService } from './level.service';
import * as _ from 'underscore';
import { PagerService } from '../services/pagination-service';

@Component({
    selector: 'category-list',
    template: require('./level-list.component.html')
})

export class LevelListComponent implements OnInit, OnDestroy{

    private levels;

    private levelLoadError;

    pager: any = {};// pager object
 
    pagedItems: any[];// paged items

    actionValue: any[] = [];

    constructor(private levelService: LevelService, private pagerService: PagerService){}

    ngOnInit(){
        this.getCategories();
    }

    getCategories(){
        this.levelService.getLevels()
                                .subscribe( 
                                                result => { 
                                                    console.log(result.levels);
                                                    this.levelLoadError='';
                                                    this.levels = result.levels;
                                                },
                                                error => {
                                                    console.log(error);
                                                    this.levelLoadError = error; 
                                                },
                                                () =>  { 
                                                    console.log('Done Fetching Levels'); 
                                                    this.setPage(1);
                                                    }
                                            );
    }

    setPage(page: number) {

        if (page < 1 || page > this.pager.totalPages) return;
 
        this.pager = this.pagerService.getPager(this.levels.length, page, 5);//get pager object from service
 
        this.pagedItems = this.levels.slice(this.pager.startIndex, this.pager.endIndex + 1);//get current page of items

    }

    ngOnDestroy(){
        this.levels = [];
    }

}