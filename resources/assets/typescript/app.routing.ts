import { Routes, RouterModule } from '@angular/router';

import { BookRoutes } from './books/book.routes';
import { CategoryRoutes } from './categories/category.routes';
import { SupplierRoutes } from './suppliers/supplier.routes';
import { LevelRoutes } from './levels/level.routes';

//import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
//import { LoginGuard } from './login/guard.service';
import { SignUpComponent } from './signup/signup.component';


const appRoutes : Routes = [

    ...BookRoutes,
    ...CategoryRoutes,
    ...SupplierRoutes,
    ...LevelRoutes,
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
