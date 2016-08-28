import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupplierService } from './supplier.service';
import { SupplierInterface } from './supplier.interface';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'supplier-add',
    template : require('./supplier-add.component.html'),
    directives: [REACTIVE_FORM_DIRECTIVES]
})

export class SupplierAddComponent implements OnInit, OnDestroy{

    private myForm: FormGroup;

    private suppSaveError;

    private suppSaveSuccess;
    
    constructor(private suppService: SupplierService, private _fb: FormBuilder, private router: Router){}

    save(model: SupplierInterface, isValid: boolean) {

        // call API to save
        if(isValid){
            this.suppSaveError='';

            this.suppService.saveSupplier(model).subscribe( 
                                result => { 
                                            this.suppSaveError='';
                                            this.suppSaveSuccess = result.success;  
                                        },
                                error => { 
                                            this.suppSaveSuccess='';
                                            this.suppSaveError = error; 
                                        },
                                    () =>  { 
                                            let _dis = this;
                                            setTimeout(function(){
                                               _dis.router.navigate(['/suppliers/list']);
                                            },2000);
                                        }
                                );
            

        }else{
            this.suppSaveError = 'Please fill all required fields';
        }

    }

    ngOnInit() {

        // we will initialize our form model here
        this.myForm = this._fb.group({
                                        name: ['', Validators.required],
                                        location: [''],
                                        contact: ['']
                                    });
    }

    ngOnDestroy(){}

}