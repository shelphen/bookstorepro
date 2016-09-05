import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'cart',
    template : require('./cart.component.html')
})

export class CartComponent implements OnInit, OnDestroy{


    ngOnInit() {
    }

    ngOnDestroy(){}

}