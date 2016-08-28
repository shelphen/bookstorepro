import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupplierService } from './supplier.service';
import { SupplierListComponent } from './supplier-list.component';
import { SupplierAddComponent } from './supplier-add.component';

@Component({
    selector: 'supplier',
    template: `
                <div style="margin-top:5%">
                    <router-outlet></router-outlet>
                </div> 
                `
})

export class SupplierComponent implements OnInit, OnDestroy{

    ngOnInit(){}

    ngOnDestroy(){}

}