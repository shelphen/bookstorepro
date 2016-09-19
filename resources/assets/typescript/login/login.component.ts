import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { User } from './user';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification/notification.service';

@Component({
    selector: 'login',
    template: require('./login.component.html') 
})
export class LoginComponent{

    public model: User = new User(0,'', '','','','', false);

    @Output() modelChange = new EventEmitter();
    
    private submitted = false;

    private active = true;

    private loginError:string = '';

    private token: string;

    constructor(private authService: AuthService,private router: Router,private notificationService: NotificationService){}
    
    onLogin() { 
        //this.submitted = true;
        //console.log(this.model);

        //this.active = false;

        this.authService.login(this.model)
                        .subscribe( 
                                    result => { 
                                        if (result.token) this.token = result.token;
                                    },
                                    error => this.notificationService.printErrorMessage('Login attempt failed ' + error),
                                     () =>  { 
                                         this.authService.getLoggedInUser(this.token)
                                                            .subscribe(
                                                                        body => { this.authService.setUserStorage(body.user); },
                                                                        error =>  console.log(error)
                                                                    );
                                         this.authService.setTokenStorage(this.token);
                                         //this.router.navigate(['/cart']);
                                         location.reload();
                                         this.router.navigate(['/home']); 
                                        }
                                    );

        //setTimeout(() => this.active = true, 0);
    }

    // getUser() {
    //     this.authService.getLoggedInUser()
    //                     .subscribe(
    //                                  body => { this.onUserChange(body.user); },
    //                                     error =>  console.log(error)
    //                             );
    // }

//     onUserChange(user){
//         console.log('Outputting Event');
//       this.model = new User( user.id, user.name, user.email, '****', user.created_at, user.updated_at, false );
//       this.modelChange.emit(this.model);
//    }

}