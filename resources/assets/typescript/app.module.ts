import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import {LocalStorage, WEB_STORAGE_PROVIDERS} from "h5webstorage";
import { Http, Headers, HTTP_PROVIDERS, HttpModule, JsonpModule } from '@angular/http';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { AppComponent } from './app.component';
import { BookComponent } from './books/book.component';
import { BookListComponent } from './books/book-list.component';
import { BookAddComponent } from './books/book-add.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signup/signup.component';

import { LoginGuard } from './login/guard.service';
import { AuthService } from './login/auth.service';
import { BookService } from './books/books.service';
import { routing } from './app.routing';


@NgModule({
    imports: [ BrowserModule, FormsModule, routing, HttpModule, JsonpModule ],
    declarations: [ AppComponent, BookListComponent, HeaderComponent, FooterComponent, LoginComponent, SignUpComponent, BookAddComponent, BookComponent ],
    providers:[ BookService, LoginGuard, AuthService, WEB_STORAGE_PROVIDERS, HTTP_PROVIDERS, FormBuilder ],
    bootstrap: [ AppComponent ]
})
export class AppModule{}
