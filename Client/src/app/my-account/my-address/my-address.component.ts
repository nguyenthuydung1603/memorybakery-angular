import { Component } from '@angular/core';
import { MyAccountService } from 'src/app/services/my-account.service';

@Component({
  selector: 'app-my-address',
  templateUrl: './my-address.component.html',
  styleUrls: ['./my-address.component.css']
})
export class MyAddressComponent {
  user: any;
  errMessage:any
  isDefaultAddress: boolean = false;
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
  setDefaultAddress() {
  // Kiểm tra xem có địa chỉ mặc định hay không
  for (let i = 0; i < this.user.User.Address.length; i++) {
    if (this.user.User.Address[i].AddressType === "Default") {
      this.isDefaultAddress = true;
      break;
    }
  }
  }
  showEdit: boolean = false;

  showEditProfile() {
    this.showEdit = true;
  }
}
