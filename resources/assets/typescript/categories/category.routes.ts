import { Routes } from '@angular/router';
import { LoginGuard } from '../login/guard.service'; 
import { CategoryListComponent } from './category-list.component';
import { CategoryAddComponent } from './category-add.component';
import { CategoryComponent } from './category.component';
 
export const CategoryRoutes: Routes = [
    {
        path: 'categories',
        component: CategoryComponent,
        canActivate:[LoginGuard],
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            { path: 'list', component: CategoryListComponent },
            { path: 'add/:id', component: CategoryAddComponent }
        ]
        
    }
];