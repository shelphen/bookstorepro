import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoryService } from './category.service';

@Component({
    selector: 'category-list',
    template: require('./category-list.component.html')
})

export class CategoryListComponent implements OnInit, OnDestroy{

    private categories;

    private catLoadError;

    constructor(private catService: CategoryService){}

    ngOnInit(){
        this.getCategories();
    }

    getCategories(){
        this.catService.getCategories()
                                .subscribe( 
                                                result => { 
                                                    console.log(result.categories);
                                                    this.catLoadError='';
                                                    this.categories = result.categories;
                                                },
                                                error => {
                                                    console.log(error);
                                                    this.catLoadError = error; 
                                                },
                                                () =>  { 
                                                    console.log('Done Fetching Categories'); 
                                                    }
                                            );
    }

    ngOnDestroy(){
        this.categories = [];
    }

}