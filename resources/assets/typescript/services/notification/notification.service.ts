import { Injectable } from '@angular/core';
import { Predicate } from '../predicate.service'
var alertify = require('alertify.js'); 
//declare var alertify: any;
 
@Injectable()
export class NotificationService {
    private _notifier: any = alertify;
 
    constructor() { 
        //this._notifier.logPosition("top right");
        this._notifier.logPosition("top center");
                        //.maxLogItems(2)
                        //.closeOnClick(true)
                        //.delay(5000)
    }
 
    /*
    Opens a confirmation dialog using the alertify.js lib
    */
    openConfirmationDialog(message: string, okCallback: () => any) {
        this._notifier.confirm(message, function (e) {
            if (e) {
                okCallback();
            } else {
            }
        });
    }
 
    /*
    Prints a success message using the alertify.js lib
    */
    printSuccessMessage(message: string, maxLog: number = 2) {
 
        this._notifier.success(message).maxLogItems(maxLog);
    }
 
    /*
    Prints an error message using the alertify.js lib
    */
    printErrorMessage(message: string, maxLog: number = 2) {
        this._notifier.error(message).maxLogItems(maxLog);
    }

    /*
    Log an error message
    */
    printLogMessage(message: string, maxLog: number = 2){
        this._notifier
                //.reset()
                .maxLogItems(maxLog)
                //.closeOnClick(false)
                //.delay(5000)
                .log(message);
        
        //alertify.set('notifier','position', 'top-right');
        //alertify.success('Current position : ' + alertify.get('notifier','position'));
        /*
        // confirm dialog
        alertify.confirm("Message", function () {
            // user clicked "ok"
        }, function() {
            // user clicked "cancel"
        });

        var msg = "<img src='https://placehold.it/256x128'>" +
                            "<h3>This is HTML</h3>" +
                            "<p>It's great, right?</p>";
                    alertify.log(msg);
        */
    }
}