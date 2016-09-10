import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';
//import {GoogleChart} from 'angular2-google-chart';

@Component({
    selector: 'report',
    template: require('./report.component.html') 
})
export class ReportComponent{

    constructor(private authService: AuthService,private router: Router){}
    

}