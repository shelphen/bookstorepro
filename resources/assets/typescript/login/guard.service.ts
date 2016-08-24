import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class LoginGuard implements CanActivate{
    
    constructor(private router: Router, private authService: AuthService){
        //
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        //console.log('Intercepted : ', state.url);
        var ss = route;

        if (this.authService.getIsLoggedIn()) { return true; }

        this.authService.redirectUrl = state.url;// Store the attempted URL for redirecting

        this.router.navigate(['/login']);// Navigate to the login page

        return false;
    }
}