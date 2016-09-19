import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoryService } from './category.service';
import { CategoryInterface } from './category.interface';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../login/auth.service';
import { NotificationService } from '../services/notification/notification.service';

@Component({
    selector: 'category-add',
    template : require('./category-add.component.html'),
    directives: [REACTIVE_FORM_DIRECTIVES]
})

export class CategoryAddComponent implements OnInit, OnDestroy{

    private myForm: FormGroup;

    private categories;

    private catSaveError;

    private catSaveSuccess;

    private selectedCatId;

    private formText: string = 'Add';
    
    constructor(
                private catService: CategoryService, 
                private _fb: FormBuilder, 
                private router: Router, 
                private activeRoute : ActivatedRoute,
                private authService: AuthService,
                private notificationService: NotificationService){}

    save(model: CategoryInterface, isValid: boolean) {
        
        // call API to save
        if(isValid){
            //this.catSaveError='';

            this.catService.saveCategory(model, this.selectedCatId).subscribe( 
                                result => this.notificationService.printSuccessMessage(result.success),
                                error => { 
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
                                               _dis.router.navigate(['/categories/list']);
                                            },2000);
                                        }
                                );
            

        }else{
            this.catSaveError = 'Please fill all required fields';
        }

    }

    ngOnInit() {
        
         this.activeRoute.params.subscribe(params => this.selectedCatId = params['id'] );

         if(this.selectedCatId > 0) {
             
             let catEditDetails: any = this.catService.getCatEditDetails();
             if(catEditDetails){

                 this.formText = 'Edit';
                // we will initialize our form model here
                this.myForm = this._fb.group({
                                        name: [catEditDetails.name, Validators.required]
                                    });

                this.catService.setCatEditDetails(undefined);
             }else{
                 // we will initialize our form model here
                this.myForm = this._fb.group({
                                        name: ['', Validators.required]
                                    });
             }

        }else{

            // we will initialize our form model here
            this.myForm = this._fb.group({
                                    name: ['', Validators.required]
                                });
        }

         
    }

    ngOnDestroy(){
        //
    }

}