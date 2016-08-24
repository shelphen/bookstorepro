import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'top-header',
    template: require('./header.component.html'),
    directives:[REACTIVE_FORM_DIRECTIVES] 
})
export class HeaderComponent implements OnInit, OnDestroy{
    
    user;

    constructor(private authService: AuthService, private router: Router){}

    get isLoggedIn(){
        if(this.authService.getIsLoggedIn()) this.user = this.authService.getLoggedInUserDetails();
        return this.authService.getIsLoggedIn();
    }

    onLogout(){
        this.authService.logout()
                        .subscribe( 
                                    result => { 
                                        console.log(result);
                                        this.authService.cleanup();
                                     },
                                    error => {
                                        this.authService.cleanup();
                                        this.router.navigate(['/login']); 
                                        console.log(error); },
                                     () =>  { this.router.navigate(['/login']); }
                                    );
    }

    // onUserModelChange($event){
    //     console.log("User Model Change Recorded...");
    //     console.log($event);
    // }

    ngOnInit(){
        //this.user = this.authService.loggedInUser;
    }

    ngOnDestroy(){
        //this.user = {};
    }
}