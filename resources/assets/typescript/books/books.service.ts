import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class BookService{
    private books = [
                        {title: 'Harry Potter', price: 23.99},
                        {title: 'The Lord Of The Rings', price: 45.99},
                        {title: 'The Da Vinci Code', price: 23.99}
                    ];
    getBooks(){
        return this.books;
    }

    saveBook(model, file){
        //private makeFileRequest (url: string, params: string[], file: File[]): Observable {

            let url = '/api/books';
            return Observable.create(observer => {

                let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();

                //for (let i = 0; i < file.length; i++) {
                formData.append("image", file[0], file[0].name);
                formData.append("title", model.title );
                formData.append("description", model.description );
                formData.append("category_id", model.category_id );
                formData.append("level_id", model.level_id );
                formData.append("author", model.author );
                formData.append("price", model.price );
                formData.append("sales_price", model.sales_price );
                formData.append("batch", model.batch );
                formData.append("supplier_name", model.supplier_name );
                formData.append("supplier_location", model.supplier_location );
                formData.append("supplier_contact", model.supplier_contact );
                formData.append("quantity_method", model.quantity_method );

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

                xhr.open('POST', url, true);
                xhr.send(formData);

            });

        //}

    }
}