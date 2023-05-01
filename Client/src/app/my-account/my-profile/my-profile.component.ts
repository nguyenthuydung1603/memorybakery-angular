import { Component } from '@angular/core';
import { MyAccountService } from 'src/app/services/my-account.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent {
  user: any;
  errMessage: any;
  editMode:boolean=false
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
  getUserDateOfBirth() {
    const dateOfBirth = new Date(this.user.User.DateOfBirth);
    const year = dateOfBirth.getFullYear();
    const month = (dateOfBirth.getMonth() + 1).toString().padStart(2, '0');
    const day = dateOfBirth.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  showEdit: boolean = false;

  showEditProfile() {
    this.showEdit = true;
  }

}
