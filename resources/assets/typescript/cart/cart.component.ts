import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CartService } from './cart.service';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NotificationService } from '../services/notification/notification.service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import "rxjs/add/operator/distinctUntilChanged";  
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/switchMap";
import * as _ from 'underscore';

@Component({
    selector: 'cart',
    template : require('./cart.component.html'),
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CartComponent implements OnInit, OnDestroy{

    //private items: Observable<Array<string>>;
    private items: any;

    private term = new FormControl();

    private listItems: any = [];

    private cartList: any = [];

    constructor(private cartService: CartService, changeDetectorRef: ChangeDetectorRef, private notificationService: NotificationService){

        //Subscribe to changes for the value of the control
        changeDetectorRef.markForCheck();
        this.term.valueChanges
                            .debounceTime(400)
                            .distinctUntilChanged()
                            .switchMap(term => this.cartService.search(term) )
                            .subscribe( 
                                        (result:any) => {
                                            this.notificationService.printLogMessage('Fetching search items', 1);
                                            this.listItems=[];
                                            this.items = result.books;
                                        },
                                        error => this.notificationService.printErrorMessage(error.error)
                                    );
        
    }

    increment(index, option){
        
        if(!this.listItems[index]) this.listItems[index] = 0;//Initialize item list model to zero if undefined
        
        if(option==='manual'){//Check for manual key strokes
            if(this.listItems[index] === 0){
                this.listItems[index]=null;
            }else{
                this.listItems[index]= this.listItems[index];
            }
            return;
        }

        this.listItems[index] = parseInt( this.listItems[index] );//Convert value to integer
        this.listItems[index] += 1;//Increase item quantity

    }

    decrement(index, option){
       
        if(!this.listItems[index]) this.listItems[index] = 0;//Initialize item list model to zero if undefined
        
        if(option==='manual'){//Check for manual key strokes
            this.listItems[index] = parseInt( this.listItems[index] );
            return;
        }

        this.listItems[index] = parseInt( this.listItems[index] );//Convert value to integer
        
        if(this.listItems[index]===0) {//Prevent decrease when item is zero 
            this.notificationService.printErrorMessage('Sorry values below zero are not allowed', 1);
            return;
        }
        this.listItems[index]-=1;//Decrease item quantity
    }

    addToCart(index){

        let _dis = this;
        _.each(this.items, function( item: any, i ) { 
            if(i === index ) {
                _dis.items[i]['cart_quantity'] = _dis.listItems[index];//Add quantity of items being sold to items array
                _dis.cartList.push(item);//Add items array to cart list
                _dis.notificationService.printSuccessMessage('Added item to cart', 1);
            }
        },[index, _dis]);

    }

    ngOnInit(){}

    ngOnDestroy(){}

}