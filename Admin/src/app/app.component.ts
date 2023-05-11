import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Admin';

  //
  constructor() {
    this.initFakeUser()
  }


  initFakeUser() {
    let user = {
      "_id": {
        "$oid": "644e0ec30aedb75801f99e00"
      },
      "FullName": "Nguyễn Thuỳ Dung",
      "Gender": "Nữ",
      "DateOfBirth": "05/15/1995",
      "Phone": "0987654321",
      "Image": "user4.jpg",
      "UserName": "thuydung",
      "Password": "2348b47d07369069de08605ded61acd6379f9babf252c50bbc7f4d758cd8623001d0707a523a5fc36296f351d9150217f8af8aa5b98735fef5ecfb36ec724772",
      "salt": "fb6934133e0006ce022c008ecd4a0298",
      "CreateDate": "10/01/2023",
      "UserType": {
        "TypeName": "Staff",
        "Role": [
          {
            "RoleName": "Admin"
          },
          {
            "RoleName": "QLSP"
          }
        ]
      },
      "Cart": [
        {
          "ProductID": "",
          "Size": "",
          "Quantity": ""
        }
      ],
      "Order": [
        ""
      ],
      "Product": [
        ""
      ],
      "Address": [
        "64525ed5eba527f557f50183"
      ],
      "Voucher": [
        ""
      ]
    }
    sessionStorage.setItem('user', JSON.stringify(user))
  }
}

