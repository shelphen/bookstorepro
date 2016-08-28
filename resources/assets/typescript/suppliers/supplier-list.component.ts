import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupplierService } from './supplier.service';

@Component({
    selector: 'supplier-list',
    template: require('./supplier-list.component.html')
})

export class SupplierListComponent implements OnInit, OnDestroy{

    private suppliers;

    private suppLoadError;

    constructor(private suppService: SupplierService){}

    ngOnInit(){
        this.getCategories();
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
                                                    console.log('Done Fetching Suppliers'); 
                                                    }
                                            );
    }

    ngOnDestroy(){
        this.suppliers = [];
    }

}