import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupplierService } from './supplier.service';
import { SupplierInterface } from './supplier.interface';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../services/notification/notification.service';

@Component({
    selector: 'supplier-add',
    template : require('./supplier-add.component.html'),
    directives: [REACTIVE_FORM_DIRECTIVES]
})

export class SupplierAddComponent implements OnInit, OnDestroy{

    private myForm: FormGroup;

    private suppSaveError;

    private suppSaveSuccess;

    private selectedSuppId;

    private formText: string = 'Add';
    
    constructor(
                private suppService: SupplierService, 
                private _fb: FormBuilder, 
                private router: Router, 
                private activeRoute : ActivatedRoute,
                private notificationService: NotificationService){}

    save(model: SupplierInterface, isValid: boolean) {

        // call API to save
        if(isValid){

            this.suppService.saveSupplier(model, this.selectedSuppId).subscribe( 
                                result => this.notificationService.printSuccessMessage(result.success),
                                error => this.notificationService.printErrorMessage(error.error),
                                    () =>  { 
                                            let _dis = this;
                                            setTimeout(function(){
                                               _dis.router.navigate(['/suppliers/list']);
                                            },2000);
                                        }
                                );
            

        }else{
            this.notificationService.printErrorMessage('Please fill all required fields');
        }

    }

    ngOnInit() {

        this.activeRoute.params.subscribe(params => this.selectedSuppId = params['id'] );

         if(this.selectedSuppId > 0) {
             
             let catEditDetails: any = this.suppService.getSupEditDetails();
             if(catEditDetails){

                 this.formText = 'Edit';
                // we will initialize our form model here
                this.myForm = this._fb.group({
                                                name: [catEditDetails.name, Validators.required],
                                                location: [catEditDetails.location],
                                                contact: [catEditDetails.contact]
                                            });

                this.suppService.setSupEditDetails(undefined);
             }else{
                 // we will initialize our form model here
                this.myForm = this._fb.group({
                                                name: ['', Validators.required],
                                                location: [''],
                                                contact: ['']
                                            });
             }

        }else{

            // we will initialize our form model here
            this.myForm = this._fb.group({
                                            name: ['', Validators.required],
                                            location: [''],
                                            contact: ['']
                                        });
        }

    }

    ngOnDestroy(){}

}