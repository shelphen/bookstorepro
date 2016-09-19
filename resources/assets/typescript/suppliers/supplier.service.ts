import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/Rx';
import { AuthService } from '../login/auth.service';
import { LocalStorage, WEB_STORAGE_PROVIDERS } from "h5webstorage";
import { Http, Headers, Response, RequestOptions } from '@angular/http';

@Injectable()
export class SupplierService{

    private suppApiUrl = '/api/suppliers';

    private supEditDetails;
    
    constructor(private localStorage: LocalStorage, private authService: AuthService, private http: Http){}


    getSuppliers(): Observable<any>{

        let headers = new Headers( { 'Content-Type': 'application/json', 'Authorization': 'Bearer '  +  localStorage.getItem('auth_token') } );
        let options = new RequestOptions({ headers: headers, body: '' });

        return this.http.get(this.suppApiUrl, options)
                    .map(this.extractData)
                    .catch(this.handleError);
    }

    saveSupplier(suppDetails, suppId): Observable<any>{

        suppDetails['id'] = suppId;
        let body = JSON.stringify( suppDetails );
        let headers = new Headers( { 'Content-Type': 'application/json', 'Authorization': 'Bearer '  +  localStorage.getItem('auth_token') } );
        let options = new RequestOptions({ headers: headers });

        return this.http.post( this.suppApiUrl, body, options )
                      .map(this.extractData)
                      .catch(this.handleError);
      
  }

  removeSupplier(supId): Observable<any>{
        
        let headers = new Headers( { 'Content-Type': 'application/json', 'Authorization': 'Bearer '  +  localStorage.getItem('auth_token') } );
        let options = new RequestOptions({ headers: headers, body: '' });
        //
        return this.http.delete(this.suppApiUrl+'/'+supId, options)
                    .map(this.extractData)
                    .catch(this.handleError);

    }

    setSupEditDetails(supDetails: any){
        this.supEditDetails = supDetails;
    }

    getSupEditDetails(){
        return this.supEditDetails;
    }

    private extractData(res: Response) {
        return res.json() || { };
    }

    private handleError (error: any) {

        console.log(error);
        if( ['user_not_found','token_expired','token_invalid','token_absent'].indexOf( error._body.error ) > -1 ){
                let errMsg = "token_error";
                return Observable.throw(errMsg);
        }

        // In a real world app, we might use a remote logging infrastructure // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);

    }

}