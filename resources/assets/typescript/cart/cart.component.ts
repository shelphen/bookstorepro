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

    private cashReceived: any;

    public pending:boolean = false;

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
        //console.log('I got to 1');
        if(!this.listItems[index]) this.listItems[index] = 0;//Initialize item list model to zero if undefined
        
        if(option==='manual'){//Check for manual key strokes
            if(this.listItems[index] === 0){
                this.listItems[index]=null;
            }else{
                this.listItems[index]= this.listItems[index];
            }
            //console.log('I got to 2');
            return;
        }
        //console.log('I got to 3');
        this.listItems[index] = parseInt( this.listItems[index] );//Convert value to integer
        this.listItems[index] += 1;//Increase item quantity
        //console.log('List Item => ', this.listItems[index]);
        return true;

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

        return true;
    }

    addToCart(index){
        this.cashReceived=null;
        let _dis = this;
        _.each(this.items, function( item: any, i ) { 
            if(i === index ) {
                _dis.items[i]['cart_quantity'] = _dis.listItems[index];//Add quantity of items being sold to items array
                _dis.items[i]['cart_total'] = _dis.listItems[index] * _dis.items[i]['sales_price']; //Add quantity of items being sold to items array
                _dis.cartList.push(item);//Add items array to cart list
                _dis.notificationService.printSuccessMessage('Added item to cart', 1);
            }
        },[index, _dis]);
    }

    removeFromCart(index){
        this.cartList.splice(index,1);
        this.cashReceived=null;
    }

    get cartTotal(){
        let total = 0;
        _.each(this.cartList, function( cart: any ) { 
            total += cart.cart_total; 
        },[]);
        return total;
    }

    get cartBalance(){
        if(!this.cashReceived) return null;
        let balance = this.cashReceived - this.cartTotal;
        if(balance < 0) return null; else return balance;
    }

    get enableCartFooter(){
        if(this.cartList.length > 0) return true; else return false;
    }

    checkout(){
        let cartObj = {items: this.cartList, cash_received: this.cashReceived, balance: this.cartBalance};

        this.cartService.checkout(cartObj).subscribe( 
                                                (result:any) => {
                                                    this.notificationService.printSuccessMessage(result.success, 1);
                                                    var _dis = this;
                                                    setTimeout(function() {_dis.downloadReceipt( result.receipt_path );}, 4000);
                                                },
                                                error => this.notificationService.printErrorMessage(error,1),
                                                () => {
                                                    this.cartList = [];
                                                    this.cashReceived=null;
                                                }
                                            );
    }

    public downloadReceipt(filePath) {

        //this.notificationService.printLogMessage('Generating sales receipt.. Please wait',1);
        //this.pending = true;
        this.cartService.download(filePath)
                            .subscribe(
                                        data => this.printReceipt(data.file),
                                        error => this.notificationService.printErrorMessage(error, 1),
                                        () => {
                                            //this.pending = false;
                                            //this.notificationService.printSuccessMessage('File downloaded successfully...', 1);
                                        }
                                    );

    }

    printReceipt(data: any){

        let byteCharacters = atob(data);//decode a base64-encoded string

        let byteNumbers = new Array(byteCharacters.length);

        let length = byteCharacters.length;

        /*
            Each character's code point (charCode) will be the value of the byte. 
            We can create an array of byte values by applying this using the .
            charCodeAt method for each character in the string.
        */
        for (let i = 0; i < length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);//Convert array of byte values into a real typed byte array

        let blob = new Blob([byteArray], { type: 'application/pdf' });

        let url= window.URL.createObjectURL(blob);

        window.open(url);
    }
    

    ngOnInit(){}

    ngOnDestroy(){}

}