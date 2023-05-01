import { Component } from '@angular/core';
import { MyAccountService } from '../services/my-account.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent {
  user: any;
  errMessage: any;
  constructor(private accountService: MyAccountService) { }

  ngOnInit(): void {
    this.accountService.getUser().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        this.errMessage = err;
      }
    });
  }
  selectedSubComponent = 'details';
  showSubList = false;
  onSelectSubComponent(subComponent: string) {
    this.selectedSubComponent = subComponent;
  }
}
