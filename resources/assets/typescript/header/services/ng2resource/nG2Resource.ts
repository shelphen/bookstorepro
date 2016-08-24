
// import {Injectable} from "@angular/core";
// import { OnInit, OnDestroy } from '@angular/core';
// import { Http, Headers, Response, RequestOptions } from '@angular/http';

// let apiPath = '';

// if(location.hostname === 'localhost' ){
//     apiPath = location.hostname + ':'+ location.port + '/api';
// }else{
//     apiPath = location.hostname + '/api';
// }

// @Injectable()


// export class Ng2Resource implements OnInit, OnDestroy{

//     private headers = { 'Content-Type': 'application/json' };
//     constructor(private http: Http) {}

//     query(){
//         //
//     }

//     put(){
//         //
//     } 

//     delete(apiAuthUrl){
//         //delete(url: string, options?: RequestOptionsArgs):
//         let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '  +  localStorage.getItem('auth_token') });
//         let options = new RequestOptions({ headers: headers, body: '' });
      
//         return this.http.get(apiAuthUrl, options)
//                     //.map(this.extractData)
//                     //.catch(this.handleError);
//     }

//     save(apiAuthUrl: string, data: Object, headerInfo: Object){

//         let body = JSON.stringify( data );
//         let headers = new Headers(this.headers);
//         let options = new RequestOptions({ headers: headers });

//         return this.http.post( apiAuthUrl, body, options );
//                       //.map(this.extractData)
//                       //.catch(this.handleError);
//     }

//     ngOnInit(){}

//     ngOnDestroy(){}

// }