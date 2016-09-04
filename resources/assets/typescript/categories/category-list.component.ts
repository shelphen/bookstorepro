import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CategoryService } from './category.service';
import * as _ from 'underscore';
import { PagerService } from '../services/pagination-service';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';

@Component({
    selector: 'category-list',
    template: require('./category-list.component.html'),
    directives: [MODAL_DIRECTIVES],
})

export class CategoryListComponent implements OnInit, OnDestroy{

    private categories;

    private catLoadError;

    pager: any = {};// pager object
 
    pagedItems: any[];// paged items

    actionValue: any[] = [];

    selectedCategoryId;

    @ViewChild('modal1') modal1: ModalComponent;

    @ViewChild('modal2') modal2: ModalComponent;

    animation: boolean = true;

    keyboard: boolean = true;

    backdrop: string | boolean = true;

    constructor(private catService: CategoryService, private pagerService: PagerService, private router: Router){}

    ngOnInit(){
        this.getCategories();
    }

    setPage(page: number) {

        if (page < 1 || page > this.pager.totalPages) return;
 
        this.pager = this.pagerService.getPager(this.categories.length, page, 5);//get pager object from service
 
        this.pagedItems = this.categories.slice(this.pager.startIndex, this.pager.endIndex + 1);//get current page of items

    }

    getCategories(){
        this.catService.getCategories()
                                .subscribe( 
                                                result => { 
                                                    //console.log(result.categories);
                                                    this.catLoadError='';
                                                    this.categories = result.categories;
                                                },
                                                error => {
                                                    console.log(error);
                                                    this.catLoadError = error; 
                                                },
                                                () =>  { 
                                                    this.setPage(1);
                                                    console.log('Done Fetching Categories'); 
                                                    }
                                            );
    }

    close() {
        //this.modal1.close();
    }

    open(catId) {
        if(!this.actionValue[catId]) return;
        this.selectedCategoryId = catId;
        if(this.actionValue[catId]=='delete') this.modal1.open('lg');
        if(this.actionValue[catId]=='edit') this.modal2.open('lg');
    }

    removeCategory(catId){
        console.log('Remove the category with id ' + catId);
    }

    editCategory(){

        let selCatId = this.selectedCategoryId;
        let dis = this;
        _.each(this.categories, function( category: any ) { 
            if( category.id === selCatId ) dis.catService.setCatEditDetails(category);
        }, selCatId);

        let route = '/categories/add/' + this.selectedCategoryId;
        this.router.navigate([ route ]); 
    }

    ngOnDestroy(){
        this.categories = [];
    }

}