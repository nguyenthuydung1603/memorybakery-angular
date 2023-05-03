import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../services/client.service';
import { User, UserType } from '../models/User';
import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements Validator {
  model: any = {};
  repassword: string=''
  userType = new UserType()
  user = new User('', '', '', '', '', '', [], '', '', '',this.userType);
  password:any;
  rememberMe: boolean = false;
  error: boolean = false;
  loggedIn: boolean = false;
  loginData: string = '';
  errMessage: any;
  returnUrl: string ='/';
  @Input('matchPassword') passwordControl!: AbstractControl;
  validate(control: AbstractControl): { [key: string]: any } | null {
    const password = this.passwordControl.value;
    const confirmPassword = control.value;
    if (password !== confirmPassword) {
      return { 'matchPassword': true };
    }
    return null;
  }

  constructor(private router:Router,private _service: ClientService){}
  postUser()
  {
    if (!/^\d{10}$/.test(this.user.Phone)) {
      alert('SĐT k hợp lệ')
    }else{
  this.userType.TypeName = "Customer"
  this._service.postUser(this.user).subscribe({
  next:(data)=>{this.user=data},
  error:(err)=>{this.errMessage=err}
  })
  alert("Bạn đã đăng kí thành công");
  localStorage.setItem('isLoggedIn', "true");
  localStorage.setItem('token', this.user.UserName);
  this.router.navigate([this.returnUrl]);
  }}
}
