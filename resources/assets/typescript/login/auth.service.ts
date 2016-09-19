import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { LocalStorage, WEB_STORAGE_PROVIDERS } from "h5webstorage";
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class AuthService {

  private apiAuthUrl: string = '/api/authenticate';

  private isLoggedIn: boolean = false;

  public loggedInUser;

  redirectUrl: string;//store the URL so we can redirect after logging in

  //public userModel: LoggedInUser = new LoggedInUser(0,'','','','');

  constructor(private http: Http, private localStorage: LocalStorage,private router: Router) {
    this.isLoggedIn = !!localStorage.getItem('auth_token');
  }


  login(loginDetails): Observable<any>{
      let body = JSON.stringify( loginDetails );
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      return this.http.post( this.apiAuthUrl, body, options )
                      .map(this.extractData)
                      .catch(this.handleError);
      
  }

  logout() {
      
      let userId  = this.getLoggedInUserDetails().id;
      let headers = new Headers( { 'Content-Type': 'application/json', 'Authorization': 'Bearer '  +  localStorage.getItem('auth_token') } );
      let options = new RequestOptions({ headers: headers, body: '' });
      let url = '/api/logout/' + userId; 
      
      return this.http.get(url, options)
                    .map(this.extractData)
                    .catch(this.handleError);
                    //.subscribe(this.extractData, this.handleError);
  }

  getIsLoggedIn(){
      //return this.isLoggedIn = !!localStorage.getItem('auth_token');
      if(localStorage.getItem('auth_token')) return this.isLoggedIn = true;else return this.isLoggedIn = false;
  }

  setIsLoggedIn(value: boolean){
      this.isLoggedIn = value;
  }

  getLoggedInUser(token): Observable<any>{
    
      let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '  +  token });
      let options = new RequestOptions({ headers: headers, body: '' });

      return this.http.get(this.apiAuthUrl, options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getLoggedInUserDetails(){
      if( !!localStorage.getItem('bs_auth_user') ) return JSON.parse( localStorage.getItem('bs_auth_user') ); else return {};
  }

  getUserToken(){
      if( !!localStorage.getItem('auth_token') ) return JSON.parse( localStorage.getItem('auth_token') ); else return {};
  }

  setTokenStorage(token){
      localStorage.setItem('auth_token', token);
  }

  setUserStorage(user){
      localStorage.setItem('bs_auth_user', JSON.stringify( user ) );
  }

  removeTokenStorage(){
      if( !!localStorage.getItem('auth_token') ) localStorage.removeItem('auth_token');
  }

  removeUserStorage(){
      if( !!localStorage.getItem('bs_auth_user') ) localStorage.removeItem('bs_auth_user');
  }

  cleanup(){
      this.removeUserStorage();
      this.removeTokenStorage();
      this.setIsLoggedIn(false);
      this.router.navigate(['/login']);
      return true;
  } 

  private extractData(res: Response) {
      return res.json() || { };
  }

  private handleError (error: any) {
      //let _dis = this;
      //if('_body' in error){
          //if('error' in error._body){
              //if( ['user_not_found','token_expired','token_invalid','token_absent'].indexOf( error._body.error ) > -1 ){
                    //_dis.cleanup();
              //}
          //}
      //}
      
      // In a real world app, we might use a remote logging infrastructure // We'd also dig deeper into the error to get a better message
      let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
      return Observable.throw(errMsg);

  }

}
