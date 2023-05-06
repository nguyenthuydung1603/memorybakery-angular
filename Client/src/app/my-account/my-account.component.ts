import { Component } from '@angular/core';
import { MyAccountService } from '../services/my-account.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent {
  user: any;
  errMessage:string='';
  constructor(private accountService: MyAccountService) {
    this.getUser();
  }

  // Hàm Get thông tin User
  getUser(){
    this.accountService.getUser().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        this.errMessage = err;
      }
    });
  }
// Thực hiện cho việc bấm vào cái nào thì hiện component cái đó
  // Khai báo
    selectedSubComponent = 'details';
    showSubList = false;
  // Viết hàm bấm vào đâu thì nhận ra giá của component div đó
  onSelectSubComponent(subComponent: string) {
    this.selectedSubComponent = subComponent;
  }
}
