import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/Rx';
import { AuthService } from '../login/auth.service';
import { LocalStorage, WEB_STORAGE_PROVIDERS } from "h5webstorage";
import { Http, Headers, Response, RequestOptions } from '@angular/http';

@Injectable()
export class BookService{

    private booksApiUrl = '/api/books';

    private bookEditDetails;
    
    constructor(private localStorage: LocalStorage, private authService: AuthService, private http: Http){}

    getBooks(){
        
        let headers = new Headers( { 'Content-Type': 'application/json', 'Authorization': 'Bearer '  +  localStorage.getItem('auth_token') } );
        let options = new RequestOptions({ headers: headers, body: '' });

        return this.http.get(this.booksApiUrl, options)
                    .map(this.extractData)
                    .catch(this.handleError);
    }

    saveBook(model, bookId, file){

            return Observable.create(observer => {
                
                let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();

                if(file){
                    console.log(file);
                    for (let i = 0; i < file.length; i++) {
                        formData.append("image", file[i], file[i].name);
                    }
                }else{
                    console.log('File not found...');
                    formData.append("image", "");
                }
                
                formData.append("id", bookId );
                formData.append("title", model.title );
                formData.append("description", model.description );
                formData.append("category_id", model.category_id );
                formData.append("level_id", model.level_id );
                formData.append("author", model.author );
                formData.append("price", model.price );
                formData.append("sales_price", model.sales_price );
                formData.append("batch", model.batch );
                formData.append("supplier_id", model.supplier_id );
                
                let qtyType = model.quantityMethod.type;
                formData.append("quantity", JSON.stringify( model.quantityMethod[qtyType] ) );
                formData.append("quantity_type", qtyType );

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            observer.next(JSON.parse(xhr.response));
                            observer.complete();
                        } else {
                            observer.error(xhr.response);
                        }
                    }
                };

                //xhr.upload.onprogress = (event) => {
                    //this.progress = Math.round(event.loaded / event.total * 100);

                    //this.progressObserver.next(this.progress);
                //};

                xhr.open('POST', this.booksApiUrl , true);
                let authToken = 'Bearer '  +  localStorage.getItem('auth_token');
                xhr.setRequestHeader('Authorization', authToken );
                xhr.send(formData);

            });

    }

    setBookEditDetails(bookDetails: any){
        this.bookEditDetails = bookDetails;
    }

    getBookEditDetails(){
        return this.bookEditDetails;
    }

    removeBook(bookId): Observable<any>{
        
        let headers = new Headers( { 'Content-Type': 'application/json', 'Authorization': 'Bearer '  +  localStorage.getItem('auth_token') } );
        let options = new RequestOptions({ headers: headers, body: '' });
        //
        return this.http.delete(this.booksApiUrl+'/'+bookId, options)
                    .map(this.extractData)
                    .catch(this.handleError);

    }

    private extractData(res: Response) {
        return res.json() || { };
    }

    private handleError (error: any) {
        //if('_body' in error){
            //if('error' in error._body){
                if( ['user_not_found','token_expired','token_invalid','token_absent'].indexOf( error._body.error ) ){
                        this.authService.cleanup();
                        location.pathname = '/login';
                        //this.router.navigate(['/login']);
                }
            //}
        //}
        
        // In a real world app, we might use a remote logging infrastructure // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);

    }

}