import { Component } from '@angular/core';
import { IUser } from '../models/User';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import swal from '../custom-function/swal2';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  user!: IUser

  constructor(private _router: Router, private service: SettingService) {
    this.getCurrentUser()
  }

  getCurrentUser() {
    let user: any = sessionStorage.getItem('user')
    if (user) user = JSON.parse(user)

    this.service.getAStaff(user._id).subscribe({
      next: (data) => {
        this.user = data
      },
      error: (err) => swal.error(err)
    })

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

  logout() {
    sessionStorage.removeItem('user')
    this._router.navigate([''])
    swal.success('Đăng xuất thành công')
  }
}
