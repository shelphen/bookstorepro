import { Component, OnInit, OnDestroy, ViewChild, trigger, state, style, animate, transition } from '@angular/core';
import { CategoryService } from './category.service';
import * as _ from 'underscore';
import { PagerService } from '../services/pagination-service';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';
import {SlimLoadingBarService, SlimLoadingBarComponent} from 'ng2-slim-loading-bar';
import { NotificationService } from '../services/notification/notification.service';
import { AuthService } from '../login/auth.service';

@Component({
    selector: 'category-list',
    template: require('./category-list.component.html'),
    directives: [MODAL_DIRECTIVES],
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

export class CategoryListComponent implements OnInit, OnDestroy{

    private categories;

    private catLoadError;

    private catRemoveSuccess;

    pager: any = {};// pager object
 
    pagedItems: any[];// paged items

    actionValue: any[] = [];

    private selectedCategoryId;

    @ViewChild('modal1') modal1: ModalComponent;

    @ViewChild('modal2') modal2: ModalComponent;

    animation: boolean = true;

    keyboard: boolean = true;

    backdrop: string | boolean = true;

    constructor(
                private catService: CategoryService, 
                private pagerService: PagerService, 
                private router: Router,
                private slimLoadingBarService:SlimLoadingBarService,
                private notificationService: NotificationService,
                private authService: AuthService){}

    ngOnInit(){
        this.getCategories();
    }

    setPage(page: number) {

        if (page < 1 || page > this.pager.totalPages) return;
 
        this.pager = this.pagerService.getPager(this.categories.length, page, 5);//get pager object from service
 
        this.pagedItems = this.categories.slice(this.pager.startIndex, this.pager.endIndex + 1);//get current page of items

    }

    getCategories(){
        this.slimLoadingBarService.start();
        this.catService.getCategories()
                                .subscribe( 
                                                result => this.categories = result.categories,
                                                error => {
                                                    if(error==='token_error') {
                                                        this.authService.cleanup();
                                                        this.router.navigate(['/login']);
                                                    }else{
                                                        this.notificationService.printErrorMessage(error);
                                                    }
                                                },
                                                () =>  { 
                                                    this.setPage(1);
                                                    this.slimLoadingBarService.complete();
                                                    this.notificationService.printSuccessMessage('Done fetching Categories...');
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

    removeCategory(){
        this.catService.removeCategory(this.selectedCategoryId)
                                .subscribe( 
                                                result => this.notificationService.printSuccessMessage(result.success),
                                                error => {
                                                    if(error==='token_error') {
                                                        this.authService.cleanup();
                                                        this.router.navigate(['/login']);
                                                    }else{
                                                        this.notificationService.printErrorMessage(error);
                                                    }
                                                },
                                                () => this.getCategories()
                                            );
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