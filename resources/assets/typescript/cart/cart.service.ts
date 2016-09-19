import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/Rx';
import { AuthService } from '../login/auth.service';
import { LocalStorage, WEB_STORAGE_PROVIDERS } from "h5webstorage";
import { Http, Headers, Response, RequestOptions,URLSearchParams, Jsonp } from '@angular/http';

//let fileSaver = require('filesaver.js');

@Injectable()
export class CartService{

    private cartApiUrl = '/api/cart';
    
    constructor(private localStorage: LocalStorage, private authService: AuthService, private http: Http, private jsonp: Jsonp){}

    search (term: string) {
        
        let headers = new Headers( { 'Content-Type': 'application/json', 'Authorization': 'Bearer '  +  localStorage.getItem('auth_token') } );
        let options = new RequestOptions({ headers: headers, body: '' });

        return this.http.get(this.cartApiUrl+'?search='+term, options)
                    .map(this.extractData)
                    .catch(this.handleError);
    }

    checkout(cart){

            let body = JSON.stringify( cart );
            let headers = new Headers( { 'Content-Type': 'application/json', 'Authorization': 'Bearer '  +  localStorage.getItem('auth_token') } );
            let options = new RequestOptions({ headers: headers });

            return this.http.post( this.cartApiUrl, body, options )
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    public download(path) {
        
        let headers = new Headers( { 'Content-Type': 'application/json', 'Authorization': 'Bearer '  +  localStorage.getItem('auth_token') } );
        let options = new RequestOptions({ headers: headers, body: '' });

        return this.http.get( `/api/receipt?path=${path}`, options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    private extractData(res: Response) {
        return res.json() || { };
    }

    private handleError (error: any) {
;
        if( ['user_not_found','token_expired','token_invalid','token_absent'].indexOf( JSON.parse(error._body).error ) > -1 ){
                 let errMsg = "token_error";
                 return Observable.throw(errMsg);
        }

        // In a real world app, we might use a remote logging infrastructure // We'd also dig deeper into the error to get a better message
        let errMsg = (JSON.parse(error._body).error) ? JSON.parse(error._body).error :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        //console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);

    }

}