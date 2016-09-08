import { Component, OnInit, OnDestroy } from '@angular/core';
import { LevelService } from './level.service';
import { LevelInterface } from './level.interface';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../services/notification/notification.service';

@Component({
    selector: 'level-add',
    template : require('./level-add.component.html'),
    directives: [REACTIVE_FORM_DIRECTIVES]
})

export class LevelAddComponent implements OnInit, OnDestroy{

    private myForm: FormGroup;

    private levelSaveError;

    private levelSaveSuccess;

    private formText: string = 'Add';

    private selectedLevelId;
    
    constructor(
                private levelService: LevelService, 
                private _fb: FormBuilder, 
                private router: Router,
                private activeRoute : ActivatedRoute,
                private notificationService: NotificationService){}

    save(model: LevelInterface, isValid: boolean) {

        //call API to save
        if(isValid){
            this.levelSaveError='';

            this.levelService.saveLevel(model, this.selectedLevelId).subscribe( 
                                result => this.notificationService.printSuccessMessage(result.success),
                                error => this.notificationService.printErrorMessage(error.error),
                                    () =>  { 
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

        this.activeRoute.params.subscribe(params => this.selectedLevelId = params['id'] );

         if(this.selectedLevelId > 0) {
             
             let levelEditDetails: any = this.levelService.getLevelEditDetails();
             if(levelEditDetails){

                 this.formText = 'Edit';
                // we will initialize our form model here
            this.myForm = this._fb.group({
                                            name: [levelEditDetails.name, Validators.required]
                                        });

                this.levelService.setLevelEditDetails(undefined);
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