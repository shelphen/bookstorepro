import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/Rx';
import { AuthService } from '../login/auth.service';
import { LocalStorage, WEB_STORAGE_PROVIDERS } from "h5webstorage";
import { Http, Headers, Response, RequestOptions,URLSearchParams, Jsonp } from '@angular/http';

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

        //var search = new URLSearchParams()
        //search.set('action', 'opensearch');
        //search.set('search', term);
        //search.set('format', 'json');
        //return this.jsonp
                    //.get('http://en.wikipedia.org/w/api.php?callback=JSONP_CALLBACK', { search })
                    //.get(this.cartApiUrl, { search })
                    //.map((response) => response.json()[1]);
                    //.map((response) => response.json());
    }

    checkout(cart){

            let body = JSON.stringify( cart );
            let headers = new Headers( { 'Content-Type': 'application/json', 'Authorization': 'Bearer '  +  localStorage.getItem('auth_token') } );
            let options = new RequestOptions({ headers: headers });

            return this.http.post( this.cartApiUrl, body, options )
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    private extractData(res: Response) {
        return res.json() || { };
    }

    private handleError (error: any) {

        console.log(error);
        let _dis = this;
        if( ['user_not_found','token_expired','token_invalid','token_absent'].indexOf( error._body.error ) ){
                 console.log('Testing cleanup');
                //_dis.authService.adam();
                _dis.authService.cleanup();
                console.log('User is not authenticated');
                //location.pathname = '/login';
                //this.router.navigate(['/login']);
        }

        // In a real world app, we might use a remote logging infrastructure // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);

    }

}