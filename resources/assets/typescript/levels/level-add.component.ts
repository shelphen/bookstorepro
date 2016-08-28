import { Component, OnInit, OnDestroy } from '@angular/core';
import { LevelService } from './level.service';
import { LevelInterface } from './level.interface';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'level-add',
    template : require('./level-add.component.html'),
    directives: [REACTIVE_FORM_DIRECTIVES]
})

export class LevelAddComponent implements OnInit, OnDestroy{

    private myForm: FormGroup;

    private levelSaveError;

    private levelSaveSuccess;
    
    constructor(private levelService: LevelService, private _fb: FormBuilder, private router: Router){}

    save(model: LevelInterface, isValid: boolean) {

        //call API to save
        if(isValid){
            this.levelSaveError='';

            this.levelService.saveLevel(model).subscribe( 
                                result => { 
                                            this.levelSaveError='';
                                            this.levelSaveSuccess = result.success;  
                                        },
                                error => { 
                                            this.levelSaveSuccess='';
                                            this.levelSaveError = error; 
                                        },
                                    () =>  { 
                                            console.log("Done Saving Level..."); 
                                            let _dis = this;
                                            setTimeout(function(){
                                               _dis.router.navigate(['/levels/list']);
                                            },2000);
                                        }
                                );
            

        }else{
            this.levelSaveError = 'Please fill all required fields';
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