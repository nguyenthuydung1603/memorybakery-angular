import { Component } from '@angular/core';
import { IUser } from '../models/User';
import { Router } from '@angular/router';
import swal from '../custom-function/swal2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  user!: IUser

  constructor(private _router: Router) {
    this.getCurrentUser()
  }

  getCurrentUser() {
    let user: any = sessionStorage.getItem('user')
    if (user) this.user = JSON.parse(user)
  }

  checkPermission(type: any): any {
    let check = false
    this.user.UserType.Role.map((role: any) => {
      if (role.RoleName == type || role.RoleName == 'Admin') check = true
    })
    return check
  }

  goTo(link: any, type: any) {
    if (type != null) {
      if (this.checkPermission(type)) this._router.navigate([`${link}`])
      else return swal.error('Bạn không được cấp quyền để truy cập trang này!')
    } else this._router.navigate([`${link}`])
  }
}
