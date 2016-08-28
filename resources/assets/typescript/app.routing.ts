import { Routes, RouterModule } from '@angular/router';
import { BookComponent } from './books/book.component';
import { BookListComponent } from './books/book-list.component';
import { BookAddComponent } from './books/book-add.component';
import { CategoryComponent } from './categories/category.component';
import { CategoryAddComponent } from './categories/category-add.component';
import { CategoryListComponent } from './categories/category-list.component';
import { SupplierComponent } from './suppliers/supplier.component';
import { SupplierAddComponent } from './suppliers/supplier-add.component';
import { SupplierListComponent } from './suppliers/supplier-list.component';
import { LevelComponent } from './levels/level.component';
import { LevelAddComponent } from './levels/level-add.component';
import { LevelListComponent } from './levels/level-list.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './login/guard.service';
import { SignUpComponent } from './signup/signup.component';


const appRoutes : Routes = [
    {
        path: 'books',
        component: BookComponent,
        canActivate:[LoginGuard],
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            { path: 'list', component: BookListComponent },
            { path: 'add/:id', component: BookAddComponent }
        ]
        
    },
    {
        path: 'categories',
        component: CategoryComponent,
        canActivate:[LoginGuard],
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            { path: 'list', component: CategoryListComponent },
            { path: 'add/:id', component: CategoryAddComponent }
        ]
        
    },
    {
        path: 'suppliers',
        component: SupplierComponent,
        canActivate:[LoginGuard],
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            { path: 'list', component: SupplierListComponent },
            { path: 'add/:id', component: SupplierAddComponent }
        ]
        
    },
    {
        path: 'levels',
        component: LevelComponent,
        canActivate:[LoginGuard],
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            { path: 'list', component: LevelListComponent },
            { path: 'add/:id', component: LevelAddComponent }
        ]
        
    },
     {
        path: 'login',
        component: LoginComponent
    },
     {
        path: 'signup',
        component: SignUpComponent
    },
    {
        path: '',
        redirectTo: '/books/list',
        pathMatch:'full'
    }
    //{
        //path: '',
        //component: HeaderComponent,
        //outlet: 'header'
        //children: [
            //{ path: '', component: LoginComponent },
            //{ path: '', component: MainComponent, outlet: 'header' }
        //]
    //},
    //{
    //  path: '**',
    //  component: PageNotFoundComponent
    //},
];

export const routing = RouterModule.forRoot(appRoutes,{ useHash: true });
