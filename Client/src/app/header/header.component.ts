import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { MyAccountService } from '../services/my-account.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  showHeader = false;
  login: boolean = false
  user: any;
  errMessage: any;
  constructor(private accountService: MyAccountService,private router: Router, private authService: AuthService,private authGuard:AuthGuard) {
    this.login=this.authGuard.isLoggedIn()
    this.accountService.getUser().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        this.errMessage = err;
      }
    });
  }
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const currentScrollPos = window.pageYOffset;
    if (this.prevScrollpos > currentScrollPos) {
      this.showHeader = false;
    } else {
      this.showHeader = true;
    }
    this.prevScrollpos = currentScrollPos;
  }

  prevScrollpos = window.pageYOffset;
  id: any;
  ngOnInit() {
    this.id = localStorage.getItem('token');
  }
  logout() {
    this.authService.logout();
    alert('Bạn đã đăng xuất');
    window.location.reload()
  }
}


