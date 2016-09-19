import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookService } from './books.service';
import { CategoryService } from '../categories/category.service';
import { LevelService } from '../levels/level.service';
import { SupplierService } from '../suppliers/supplier.service';
import { BookInterface } from './book.interface';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../services/notification/notification.service';
import { AuthService } from '../login/auth.service';

@Component({
    selector: 'book-add',
    template : require('./book-add.component.html'),
    directives: [REACTIVE_FORM_DIRECTIVES]
})

export class BookAddComponent implements OnInit, OnDestroy{

    private myForm: FormGroup;

    private QUANTITY_METHOD_TYPE = { BOX: 'box',STOCK: 'stock' };

    private uploadedFile;

    private categories;

    private levels;

    private suppliers;

    private bookSaveError;

    private bookSaveSuccess;

    private selectedBookId;

    private formText: string = 'Add';
    
    constructor(
                private bookService: BookService, 
                private _fb: FormBuilder, 
                private router: Router, 
                private activeRoute : ActivatedRoute,
                private levelService : LevelService,
                private catService : CategoryService,
                private suppService : SupplierService,
                private notificationService: NotificationService,
                private authService: AuthService){}

    save(model: BookInterface, isValid: boolean) {

        // call API to save
 
        if(isValid){
            
            //if(this.uploadedFile){

                this.bookService.saveBook(model, this.selectedBookId, this.uploadedFile).subscribe( 
                                    result =>this.notificationService.printSuccessMessage(result.success),
                                    error => { 
                                                console.log(error);
                                                if(error==='token_error') {
                                                    this.authService.cleanup();
                                                    this.router.navigate(['/login']);
                                                }else{
                                                    this.notificationService.printErrorMessage(error); 
                                                }
                                            },
                                     () =>  { 
                                                let _dis = this;
                                                setTimeout(function(){
                                                    _dis.router.navigate(['/books/list']);
                                                },2000);
                                            }
                                    );
                
            // }else{
            //     console.log('No image file uploaded');
            //     //alert("Image file was not uploaded");
            //     return;
            // }

        }else{
            this.bookSaveError = 'Please fill all required fields'; 
        }

        //console.log(model, isValid);
        //if(this.uploadedFile)console.log(this.uploadedFile); else console.log("No file uploaded");

    }

    ngOnInit() {

        this.activeRoute.params.subscribe(params => this.selectedBookId = params['id'] );

         if(this.selectedBookId > 0) {
             
             let bookEditDetails: any = this.bookService.getBookEditDetails();
             if(bookEditDetails){
                 //console.log('Book Edit Details', bookEditDetails);
                 //console.log('Box type', this.initQuantityMethodFormGroup());
                 this.formText = 'Edit';
                // we will initialize our form model here
                // this.myForm = this._fb.group({
                //                         name: [bookEditDetails.name, Validators.required]
                //                     });

                // we will initialize our form model here
                if(bookEditDetails.quantity_type === 'box'){
                    this.myForm = this._fb.group({
                                                title: [bookEditDetails.title, Validators.required],
                                                quantityMethod: this._fb.group({
                                                                                    type: ['box'],
                                                                                    box: this._fb.group({
                                                                                                            number_of_boxes: [bookEditDetails.number_of_boxes, Validators.required],
                                                                                                            quantity: [bookEditDetails.quantity, Validators.required]
                                                                                                        }),
                                                                                    stock: this._fb.group( {
                                                                                                            quantity: ['', Validators.required]
                                                                                                        }),
                                                                                }),
                                                description: [ bookEditDetails.description ],
                                                category_id: [ bookEditDetails.category_id, Validators.required ],
                                                level_id: [ bookEditDetails.level_id , Validators.required],
                                                author: [ bookEditDetails.author, Validators.required ],
                                                price: [ bookEditDetails.price, Validators.required ],
                                                sales_price: [ bookEditDetails.sales_price, Validators.required ],
                                                batch: [ bookEditDetails.batch ],
                                                supplier_id: [ bookEditDetails.supplier_id],
                                                image: ['']
                                            });

                }else if(bookEditDetails.quantity_type === 'stock'){

                    this.myForm = this._fb.group({
                                                title: [bookEditDetails.title, Validators.required],
                                                quantityMethod: this._fb.group({
                                                                                    type: ['stock'],
                                                                                    box: this._fb.group({
                                                                                                            number_of_boxes: ['', Validators.required],
                                                                                                            quantity: ['', Validators.required]
                                                                                                        }),
                                                                                    stock: this._fb.group( {
                                                                                                            quantity: [bookEditDetails.quantity, Validators.required]
                                                                                                        }),
                                                                                }),
                                                description: [bookEditDetails.description],
                                                category_id: [bookEditDetails.category_id, Validators.required],
                                                level_id: [bookEditDetails.levels_id, Validators.required],
                                                author: [bookEditDetails.author, Validators.required],
                                                price: [bookEditDetails.price, Validators.required],
                                                sales_price: [bookEditDetails.sales_price, Validators.required],
                                                batch: [bookEditDetails.batch],
                                                supplier_id: [bookEditDetails.suppliers_id],
                                                image: ['']
                                            });

                }

                this.bookService.setBookEditDetails(undefined);

             }else{
                // we will initialize our form model here
                this.myForm = this._fb.group({
                                                title: ['', Validators.required],
                                                quantityMethod: this.initQuantityMethodFormGroup(),
                                                description: [''],
                                                category_id: ['', Validators.required],
                                                level_id: ['', Validators.required],
                                                author: ['', Validators.required],
                                                price: ['', Validators.required],
                                                sales_price: ['', Validators.required],
                                                batch: [''],
                                                supplier_id: [''],
                                                image: ['']
                                            });
             }

        }else{

            // we will initialize our form model here
            this.myForm = this._fb.group({
                                            title: ['', Validators.required],
                                            quantityMethod: this.initQuantityMethodFormGroup(),
                                            description: [''],
                                            category_id: ['', Validators.required],
                                            level_id: ['', Validators.required],
                                            author: ['', Validators.required],
                                            price: ['', Validators.required],
                                            sales_price: ['', Validators.required],
                                            batch: [''],
                                            supplier_id: [''],
                                            image: ['']
                                        });
        }
        
        this.subscribePaymentTypeChanges();// after form model initialization // subscribe to quantity method type changes

        this.setPaymentMethodType(this.QUANTITY_METHOD_TYPE.STOCK);// set default type to STOCK

        this.getBookCategories();

        this.getBookLevels();

        this.getBookSuppliers();
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
            number_of_boxes: ['', Validators.required],
            quantity: ['', Validators.required]
        };

        return model;
    }

    initStockQuantityModel() {
        // initialize bank model
        const model = {
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

    onChange(event) {

        console.log('onChange');
        var files = event.srcElement.files;
        //console.log(files);
        this.uploadedFile = files;
        //console.log( (<any>this.myForm).controls);
        // update quantity method type value
        //const ctrl: FormControl = (<any>this.myForm).controls.image;
        //ctrl.updateValue(files);

        //myForm.controls.image
        //this.service.makeFileRequest('http://localhost:8182/upload', [], files).subscribe(() => {
        //console.log('sent');
        //});

    }

    getBookCategories(){

        this.catService.getCategories()
                            .subscribe( 
                                    result => { 
                                        this.categories = result.categories;
                                    },
                                    error => {
                                         if(error==='token_error') {
                                            this.authService.cleanup();
                                            this.router.navigate(['/login']);
                                        }else{
                                            //this.bookCatErrors = error; 
                                        }
                                    },
                                    () =>  {}
                                );
    }

    getBookLevels(){

        this.levelService.getLevels()
                            .subscribe( 
                                    result => { 
                                        //console.log(result);
                                        this.levels = result.levels;
                                    },
                                    error => {
                                        if(error==='token_error') {
                                            this.authService.cleanup();
                                            this.router.navigate(['/login']);
                                        }else{
                                            //this.bookCatErrors = error; 
                                        }
                                    },
                                    () =>  {}
                                );

    }

    getBookSuppliers(){

        this.suppService.getSuppliers()
                            .subscribe( 
                                    result =>this.suppliers = result.suppliers,
                                    error => {
                                        if(error==='token_error') {
                                            this.authService.cleanup();
                                            this.router.navigate(['/login']);
                                        }else{
                                            //this.bookCatErrors = error; 
                                        }
                                    },
                                    () =>  {}
                                );

    }

    ngOnDestroy(){}

}