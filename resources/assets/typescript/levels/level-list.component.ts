import { Component, OnInit, OnDestroy } from '@angular/core';
import { LevelService } from './level.service';

@Component({
    selector: 'category-list',
    template: require('./level-list.component.html')
})

export class LevelListComponent implements OnInit, OnDestroy{

    private levels;

    private levelLoadError;

    constructor(private levelService: LevelService){}

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
                                                    }
                                            );
    }

    ngOnDestroy(){
        this.levels = [];
    }

}