import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/Rx';
import { AuthService } from '../login/auth.service';
import { LocalStorage, WEB_STORAGE_PROVIDERS } from "h5webstorage";
import { Http, Headers, Response, RequestOptions } from '@angular/http';

@Injectable()
export class LevelService{

    private levelApiUrl = '/api/levels';

    private levelEditDetails: any;
    
    constructor(private localStorage: LocalStorage, private authService: AuthService, private http: Http){}


    getLevels(): Observable<any>{

        let headers = new Headers( { 'Content-Type': 'application/json', 'Authorization': 'Bearer '  +  localStorage.getItem('auth_token') } );
        let options = new RequestOptions({ headers: headers, body: '' });

        return this.http.get(this.levelApiUrl, options)
                    .map(this.extractData)
                    .catch(this.handleError);
    }

    saveLevel(levelDetails, levelId): Observable<any>{
        
        levelDetails['id']=levelId;
        let body = JSON.stringify( levelDetails );
        let headers = new Headers( { 'Content-Type': 'application/json', 'Authorization': 'Bearer '  +  localStorage.getItem('auth_token') } );
        let options = new RequestOptions({ headers: headers });

        return this.http.post( this.levelApiUrl, body, options )
                      .map(this.extractData)
                      .catch(this.handleError);
      
  }

  removeLevel(levelId): Observable<any>{
        
        let headers = new Headers( { 'Content-Type': 'application/json', 'Authorization': 'Bearer '  +  localStorage.getItem('auth_token') } );
        let options = new RequestOptions({ headers: headers, body: '' });
        
        return this.http.delete(this.levelApiUrl+'/'+levelId, options)
                    .map(this.extractData)
                    .catch(this.handleError);

    }

    setLevelEditDetails(supDetails: any){
        this.levelEditDetails = supDetails;
    }

    getLevelEditDetails(){
        return this.levelEditDetails;
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