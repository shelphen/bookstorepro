import { Routes } from '@angular/router';
import { LoginGuard } from '../login/guard.service'; 
import { BookListComponent } from './book-list.component';
import { BookAddComponent } from './book-add.component';
import { BookComponent } from './book.component';
 
export const BookRoutes: Routes = [
    {
        path: 'books',
        component: BookComponent,
        canActivate:[LoginGuard],
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            { path: 'list', component: BookListComponent },
            { path: 'add/:id', component: BookAddComponent }
        ]
        
    }
];