
import { bootstrap } from '@angular/platform-browser-dynamic';
import { Component } from '@angular/core';
import { AuthService } from './login/auth.service';

@Component({
    selector: 'app',
    //styleUrls:['../css/bootstrap.min.css','../css/font-awesome.min.css','../css/prettyPhoto.css'],
    template: `
        <top-header *ngIf="isLoggedIn"></top-header>

        <div class="container">
            <router-outlet></router-outlet>
        </div>

        <bottom-footer *ngIf="isLoggedIn"></bottom-footer>        
    `,
})
export class AppComponent {

    constructor(private authService: AuthService){}

    get isLoggedIn(){
        return this.authService.getIsLoggedIn();
    }
}

