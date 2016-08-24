import { Injectable } from '@angular/core';

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
}