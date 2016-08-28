import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoryService } from './category.service';
import { CategoryInterface } from './category.interface';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

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
    
    constructor(private catService: CategoryService, private _fb: FormBuilder, private router: Router){}

    save(model: CategoryInterface, isValid: boolean) {

        // call API to save
        if(isValid){
            this.catSaveError='';

            this.catService.saveCategory(model).subscribe( 
                                result => { 
                                            this.catSaveError='';
                                            this.catSaveSuccess = result.success;  
                                        },
                                error => { 
                                            this.catSaveSuccess='';
                                            this.catSaveError = error; 
                                        },
                                    () =>  { 
                                            console.log("Done Saving Category..."); 
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

        // we will initialize our form model here
        this.myForm = this._fb.group({
                                        name: ['', Validators.required]
                                    });
    }

    ngOnDestroy(){
        //
    }

}