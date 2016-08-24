import { Routes, RouterModule } from '@angular/router';
import { BookComponent } from './books/book.component';
import { BookListComponent } from './books/book-list.component';
import { BookAddComponent } from './books/book-add.component';
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
