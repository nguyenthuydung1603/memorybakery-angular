import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/interfaces/login';
import { AuthService } from '../services/auth.service' ;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../services/client.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: string="";
  loginForm!: FormGroup;
  message: string='';
  returnUrl: string ='';
  errors:string=''
  dataUser: any
  constructor(
     private formBuilder: FormBuilder,
     private router: Router,
     private authService: AuthService,
    private loginService: ClientService
  ) { }
  ngOnInit() {
     this.loginForm = this.formBuilder.group({
        userid: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]]
     });
  }
// convenience getter for easy access to form fields
get f() { return this.loginForm.controls; }

login() {
  if (this.loginForm.invalid) {
    return;
 }
 else{
  this.loginService.postLogin(this.f['userid'].value,this.f['password'].value).subscribe({
      next:(data)=>{
        this.dataUser = data
        if (this.dataUser.UserName){
        localStorage.setItem('isLoggedIn', "true");
        localStorage.setItem('token', this.f['userid'].value);
        this.router.navigate([''])
      }else {
        alert(`${this.dataUser.message}`)
      }
    },
      error:(err)=>{this.error=err}
    })
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

