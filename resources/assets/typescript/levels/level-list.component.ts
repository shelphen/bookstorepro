import { Component, OnInit, OnDestroy, ViewChild, trigger, state, style, animate, transition } from '@angular/core';
import { LevelService } from './level.service';
import * as _ from 'underscore';
import { PagerService } from '../services/pagination-service';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from '@angular/router';
import {SlimLoadingBarService, SlimLoadingBarComponent} from 'ng2-slim-loading-bar';
import { NotificationService } from '../services/notification/notification.service';
import { AuthService } from '../login/auth.service';

@Component({
    selector: 'category-list',
    template: require('./level-list.component.html'),
    animations: [
        trigger('flyInOut', [
            state('in', style({ opacity: 1, transform: 'translateX(0)' })),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(-100%)'
                }),
                animate('0.6s ease-in')
            ]),
            transition('* => void', [
                animate('0.2s 10 ease-out', style({
                    opacity: 0,
                    transform: 'translateX(100%)'
                }))
            ])
        ])
    ]
})

export class LevelListComponent implements OnInit, OnDestroy{

    private levels;

    private levelLoadError;

    pager: any = {};// pager object
 
    pagedItems: any[];// paged items

    actionValue: any[] = [];

    @ViewChild('modal1') modal1: ModalComponent;

    @ViewChild('modal2') modal2: ModalComponent;

    animation: boolean = true;

    keyboard: boolean = true;

    backdrop: string | boolean = true;

    private selectedLevelId;

    constructor(
                private levelService: LevelService, 
                private pagerService: PagerService,
                private router: Router,
                private slimLoadingBarService:SlimLoadingBarService,
                private notificationService: NotificationService,
                private authService: AuthService){}

    ngOnInit(){
        this.getLevels();
    }

    getLevels(){
        this.slimLoadingBarService.start();
        this.levelService.getLevels()
                                .subscribe( 
                                                result => this.levels = result.levels,
                                                error => {
                                                    if(error==='token_error') {
                                                        this.authService.cleanup();
                                                        this.router.navigate(['/login']);
                                                    }else{
                                                        this.notificationService.printErrorMessage(error);
                                                    }
                                                },
                                                () =>  { 
                                                        this.setPage(1);
                                                        this.slimLoadingBarService.complete();
                                                        this.notificationService.printSuccessMessage('Done fetching Class...');
                                                    }
                                            );
    }

    setPage(page: number) {

        if (page < 1 || page > this.pager.totalPages) return;
 
        this.pager = this.pagerService.getPager(this.levels.length, page, 5);//get pager object from service
 
        this.pagedItems = this.levels.slice(this.pager.startIndex, this.pager.endIndex + 1);//get current page of items

    }

    close() {
        //this.modal1.close();
    }

    open(supId) {
        if(!this.actionValue[supId]) return;
        this.selectedLevelId = supId;
        if(this.actionValue[supId]=='delete') this.modal1.open('lg');
        if(this.actionValue[supId]=='edit') this.modal2.open('lg');
    }

    removeLevel(){
        this.levelService.removeLevel(this.selectedLevelId)
                                .subscribe( 
                                                result => this.notificationService.printSuccessMessage(result.success),
                                                error => {
                                                    if(error==='token_error') {
                                                        this.authService.cleanup();
                                                        this.router.navigate(['/login']);
                                                    }else{
                                                        this.notificationService.printErrorMessage(error);
                                                    }
                                                },
                                                () => this.getLevels()
                                            );
    }

    editLevel(){

        let selSupId = this.selectedLevelId;
        let dis = this;
        _.each(this.levels, function( level: any ) { 
            if( level.id === selSupId ) dis.levelService.setLevelEditDetails(level);
        }, selSupId);

        let route = '/levels/add/' + this.selectedLevelId;
        this.router.navigate([ route ]); 
    }

    ngOnDestroy(){
        this.levels = [];
    }

}