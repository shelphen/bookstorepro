import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookService } from './books.service';
import { BookInterface } from './book.interface';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'book-add',
    template : require('./book-add.component.html'),
    directives: [REACTIVE_FORM_DIRECTIVES]
})

export class BookAddComponent implements OnInit, OnDestroy{

    public myForm: FormGroup;

    public QUANTITY_METHOD_TYPE = {
                                        BOX: 'box',
                                        STOCK: 'stock'
                                };
    
    constructor(private bookService: BookService, private _fb: FormBuilder){}

    save(model: BookInterface, isValid: boolean) {
        // call API to save
        // ...
        console.log(model, isValid);
    }

    ngOnInit() {
        // we will initialize our form model here
        this.myForm = this._fb.group({
                                        title: new FormControl(),
                                        quantityMethod: this.initQuantityMethodFormGroup(),
                                        description: new FormControl(),
                                        category_id: new FormControl(),
                                        level_id: new FormControl(),
                                        author: new FormControl(),
                                        price: new FormControl(),
                                        sales_price: new FormControl(),
                                        batch: new FormControl(),
                                        supplier_name: new FormControl(),
                                        supplier_location: new FormControl(),
                                        supplier_contact: new FormControl()
                                    });
        // after form model initialization

        // subscribe to quantity method type changes
        this.subscribePaymentTypeChanges();

        // set default type to STOCK
        this.setPaymentMethodType(this.QUANTITY_METHOD_TYPE.STOCK);
    }

    initQuantityMethodFormGroup() {
        // initialize payment method form group
        const group = this._fb.group({
                                        type: ['stock'],
                                        box: this._fb.group(this.initBoxQuantityModel()),
                                        stock: this._fb.group(this.initStockQuantityModel()),
                                    });

        return group;
    }

    initBoxQuantityModel() {
        // initialize card model

        // regex for master, visa, amex card
        // you get valid testing credit card from http://www.getcreditcardnumbers.com/
        //const cardNoRegex = `^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$`;

        // regex for expiry format MM/YY
        //const expiryRegex = `^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$`;

        const model = {
            //cardNo: ['', [Validators.required, Validators.pattern(cardNoRegex)]],
            //cardHolder: ['', Validators.required],
            //expiry: ['', [Validators.required, Validators.pattern(expiryRegex)]]
            number_of_boxes: ['', Validators.required],
            quantity_in_box: ['', Validators.required]
        };

        return model;
    }

    initStockQuantityModel() {
        // initialize bank model
        const model = {
            //accountNo: ['', Validators.required],
            //accountHolder: ['', Validators.required],
            //routingNo: ['', Validators.required]
            quantity: ['', Validators.required]
        };

        return model;
    }

    setPaymentMethodType(type: string) {
        // update quantity method type value
        const ctrl: FormControl = (<any>this.myForm).controls.quantityMethod.controls.type;
        ctrl.updateValue(type);
    
    }

    subscribePaymentTypeChanges() {
    // controls
    const pmCtrl = (<any>this.myForm).controls.quantityMethod;
    const boxCtrl = pmCtrl.controls.box;
    const stockCtrl = pmCtrl.controls.stock;

    // initialize value changes stream
    const changes$ = pmCtrl.controls.type.valueChanges;

    // subscribe to the stream
    changes$.subscribe(quantityMethodType => {
        // BOX
        if (quantityMethodType === this.QUANTITY_METHOD_TYPE.BOX) {
            // apply validators to each bank fields, retrieve validators from bank model
            Object.keys(boxCtrl.controls).forEach(key => {
                boxCtrl.controls[key].setValidators(this.initBoxQuantityModel()[key][1]);
                boxCtrl.controls[key].updateValueAndValidity();
            });

            // remove all validators from card fields
            Object.keys(stockCtrl.controls).forEach(key => {
                stockCtrl.controls[key].setValidators(null);
                stockCtrl.controls[key].updateValueAndValidity();
            });
        }

        // STOCK
        if (quantityMethodType === this.QUANTITY_METHOD_TYPE.STOCK) {
            // remove all validators from bank fields
            Object.keys(boxCtrl.controls).forEach(key => {
                boxCtrl.controls[key].setValidators(null);
                boxCtrl.controls[key].updateValueAndValidity();
            });

            // apply validators to each card fields, retrieve validators from card model
            Object.keys(stockCtrl.controls).forEach(key => {
                stockCtrl.controls[key].setValidators(this.initStockQuantityModel()[key][1]);
                stockCtrl.controls[key].updateValueAndValidity();
            });
        }

    });
}

    ngOnDestroy(){
        //
    }

}