import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoginService } from '../login.service';
import swal from '../custom-function/swal2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @Output() isLoginChange = new EventEmitter<any>();
  @Input() isLogin!: any
  loginForm: any = {
    userName: '',
    password: ''
  }

  constructor(private service: LoginService, private _router: Router) { }

  login() {

    this.service.login(this.loginForm).subscribe({
      next: (data) => {
        if (data.data && data.data.UserType.TypeName == 'Staff') {
          this.isLogin = true
          this.isLoginChange.emit(this.isLogin)
          sessionStorage.setItem('user', JSON.stringify(data.data))
          this._router.navigate([`dashboard`])
          swal.success(data.message)
        } else swal.error(data.message)

      },
      error: (err) => swal.error(err, 4000)
    })
  }
}
