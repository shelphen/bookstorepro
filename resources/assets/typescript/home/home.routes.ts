import { Routes } from '@angular/router';
import { LoginGuard } from '../login/guard.service'; 
import { HomeComponent } from './home.component';
 
export const HomeRoutes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        canActivate:[LoginGuard]
        
    }
];