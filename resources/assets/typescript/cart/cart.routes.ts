import { Routes } from '@angular/router';
import { LoginGuard } from '../login/guard.service'; 
import { CartComponent } from './cart.component';
 
export const CartRoutes: Routes = [
    {
        path: 'cart',
        component: CartComponent,
        canActivate:[LoginGuard]
        
    }
];