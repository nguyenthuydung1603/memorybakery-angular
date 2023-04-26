import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/interfaces/login';
import { AuthService } from '../services/auth.service' ;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: Login = { userid: "duong", password: "111111" }
  loginForm!: FormGroup;
  message: string='';
  returnUrl: string ='';
  errors:string=''
  constructor(
     private formBuilder: FormBuilder,
     private router: Router,
     private authService: AuthService
  ) { }
  ngOnInit() {
     this.loginForm = this.formBuilder.group({
        userid: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]]
     });
  this.returnUrl = '/';
  this.authService.logout();
  }
// convenience getter for easy access to form fields
get f() { return this.loginForm.controls; }
login() {
  // stop here if form is invalid
  if (this.loginForm.invalid) {
     return;
  }
  else {
     if (this.f['userid'].value == this.model.userid && this.f['password'].value == this.model.password) {
     //this.authService.authLogin(this.model);
     localStorage.setItem('isLoggedIn', "true");
     localStorage.setItem('token', this.f['userid'].value);
     this.router.navigate([this.returnUrl]);
     }
  else {
     this.message = "Tên tài khoản của bạn hoặc Mật khẩu không đúng, vui lòng thử lại!";
     }
    }

 }
}













  // model: any = {};
  // user:any;
  // password:any;
  // rememberMe: boolean = false;
  // error: boolean = false;
  // loggedIn: boolean = false;
  // loginData: string = '';
  // constructor(private router:Router){
  // }
  // login() {
  //   if (this.model.user === 'duongdv20406' && this.model.password === 'duong20406') {
  //     this.loggedIn = true;
  //     this.loginData = JSON.stringify(this.model);
  //     if (this.rememberMe) {
  //       localStorage.setItem('loginData', this.loginData);
  //     }
  //     this.router.navigate([''])
  //   } else {
  //     this.error = true;
  //   }
  // }

