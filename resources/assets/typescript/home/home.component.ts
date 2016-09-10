import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'home',
    template : require('./home.component.html')
})

export class HomeComponent implements OnInit, OnDestroy{

    constructor(private router: Router){}
    ngOnInit() {}

    ngOnDestroy(){}

    route(event, path){
        console.log(event);
        //console.log(path);
        this.router.navigate([path]);
    }

}