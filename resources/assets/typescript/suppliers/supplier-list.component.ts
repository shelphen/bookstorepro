import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupplierService } from './supplier.service';
import * as _ from 'underscore';
import { PagerService } from '../services/pagination-service';

@Component({
    selector: 'supplier-list',
    template: require('./supplier-list.component.html')
})

export class SupplierListComponent implements OnInit, OnDestroy{

    private suppliers;

    private suppLoadError;

    pager: any = {};// pager object
 
    pagedItems: any[];// paged items

    private actionValue:any[] =[];

    constructor(private suppService: SupplierService, private pagerService: PagerService){}

    ngOnInit(){
        this.getCategories();
    }

    setPage(page: number) {

        if (page < 1 || page > this.pager.totalPages) return;
 
        this.pager = this.pagerService.getPager(this.suppliers.length, page, 5);//get pager object from service
 
        this.pagedItems = this.suppliers.slice(this.pager.startIndex, this.pager.endIndex + 1);//get current page of items

    }

    getCategories(){
        this.suppService.getSuppliers()
                                .subscribe( 
                                                result => { 
                                                    console.log(result.suppliers);
                                                    this.suppLoadError='';
                                                    this.suppliers = result.suppliers;
                                                },
                                                error => {
                                                    console.log(error);
                                                    this.suppLoadError = error; 
                                                },
                                                () =>  { 
                                                    this.setPage(1);
                                                    console.log('Done Fetching Suppliers'); 
                                                    }
                                            );
    }

    ngOnDestroy(){
        this.suppliers = [];
    }

}