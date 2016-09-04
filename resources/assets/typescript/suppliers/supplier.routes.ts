import { Routes } from '@angular/router';
import { LoginGuard } from '../login/guard.service'; 
import { SupplierListComponent } from './supplier-list.component';
import { SupplierAddComponent } from './supplier-add.component';
import { SupplierComponent } from './supplier.component';
 
export const SupplierRoutes: Routes = [
    {
        path: 'suppliers',
        component: SupplierComponent,
        canActivate:[LoginGuard],
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            { path: 'list', component: SupplierListComponent },
            { path: 'add/:id', component: SupplierAddComponent }
        ]
        
    }
];