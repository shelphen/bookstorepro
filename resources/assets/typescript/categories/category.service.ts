import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/Rx';
import { AuthService } from '../login/auth.service';
import { LocalStorage, WEB_STORAGE_PROVIDERS } from "h5webstorage";
import { Http, Headers, Response, RequestOptions } from '@angular/http';

@Injectable()
export class CategoryService{

    private catApiUrl = '/api/categories';

    private catEditDetails: any;
    
    constructor(private localStorage: LocalStorage, private authService: AuthService, private http: Http){}


    getCategories(): Observable<any>{

        let headers = new Headers( { 'Content-Type': 'application/json', 'Authorization': 'Bearer '  +  localStorage.getItem('auth_token') } );
        let options = new RequestOptions({ headers: headers, body: '' });

        return this.http.get(this.catApiUrl, options)
                    .map(this.extractData)
                    .catch(this.handleError);
    }

    saveCategory(catDetails, catId): Observable<any>{

            //catDetails.append({id: catId});
            console.log(catDetails);
            console.log(catId);
            
            catDetails['id'] = catId;

            let body = JSON.stringify( catDetails );
            let headers = new Headers( { 'Content-Type': 'application/json', 'Authorization': 'Bearer '  +  localStorage.getItem('auth_token') } );
            let options = new RequestOptions({ headers: headers });

            return this.http.post( this.catApiUrl, body, options )
                        .map(this.extractData)
                        .catch(this.handleError);
        
    }

    setCatEditDetails(catDetails: any){
        this.catEditDetails = catDetails;
    }

    getCatEditDetails(){
        return this.catEditDetails;
    }

    private extractData(res: Response) {
        return res.json() || { };
    }

    private handleError (error: any) {

        console.log(error);
        if( ['user_not_found','token_expired','token_invalid','token_absent'].indexOf( error._body.error ) ){
                this.authService.cleanup();
                location.pathname = '/login';
                //this.router.navigate(['/login']);
        }

        // In a real world app, we might use a remote logging infrastructure // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);

    }

}