import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guards/auth.guard';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent  implements OnInit  {
  login: boolean = false
  backToTop(): void {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }
  id: any;
  constructor(private router: Router, private authService: AuthService, private authGuard:AuthGuard) {
    this.login=this.authGuard.isLoggedIn()
  }
  ngOnInit() {
    this.id = localStorage.getItem('token');
  }

}
