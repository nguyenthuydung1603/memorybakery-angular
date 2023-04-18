import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  model: any = {};
  user:any;
  password:any;
  rememberMe: boolean = false;
  error: boolean = false;
  loggedIn: boolean = false;
  loginData: string = '';
  constructor(private router:Router){
  }
  login() {
    if (this.model.user === 'duongdv20406' && this.model.password === 'duong20406') {
      this.loggedIn = true;
      this.loginData = JSON.stringify(this.model);
      if (this.rememberMe) {
        localStorage.setItem('loginData', this.loginData);
      }
      this.router.navigate([''])
    } else {
      this.error = true;
    }
  }
}
