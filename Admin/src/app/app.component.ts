import { Component } from '@angular/core';
import { IUser } from './models/User';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import swal from './custom-function/swal2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Admin';
  currentRoute: string = ''
  isLogin: boolean = false
  user!: IUser
  constructor(private _router: Router) {
    this.getCurrentUser()
    this.checkRoute()
  }

  onChangeLoginState(eventData: any) {
    this.isLogin = eventData
  }

  getCurrentUser() {
    let user: any = sessionStorage.getItem('user')
    if (user) {
      this.user = JSON.parse(user)
      this.isLogin = true
    } else {
      this.isLogin = false
    }
  }

  checkUserExist() {
    let user: any = sessionStorage.getItem('user')
    if (!user) {
      this.isLogin = false
      swal.error('Phiên đăng nhập đã hết hạn!')
    }
  }

  checkRoute() {
    this.currentRoute = "";
    this._router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.checkUserExist()
      }

      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }

      if (event instanceof NavigationError) {
        console.log(event.error);
      }
    });
  }

}

