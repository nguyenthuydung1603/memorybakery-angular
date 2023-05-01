import { Component } from '@angular/core';
import { MyAccountService } from 'src/app/services/my-account.service';

@Component({
  selector: 'app-my-pass-word',
  templateUrl: './my-pass-word.component.html',
  styleUrls: ['./my-pass-word.component.css']
})
export class MyPassWordComponent {
  user: any;
  errMessage:any
  constructor(private accountService: MyAccountService) { }

  ngOnInit(): void {
    this.accountService.getUser().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        this.errMessage = err;
      }
    })
  }
  showPassword = false;
  newPassword = '';
  showNewPassword = false;
  showReNewPassword = false;

  toggleShowPassword(passwordType: string) {
    if (passwordType === 'current') {
      this.showPassword = !this.showPassword;
    } else if (passwordType === 'new') {
      this.showNewPassword = !this.showNewPassword;
    }else if (passwordType === 'reNew') {
      this.showReNewPassword = !this.showReNewPassword;
    }
  }
}
