import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { MyAccountService } from 'src/app/services/my-account.service';

@Component({
  selector: 'app-my-edit-profile',
  templateUrl: './my-edit-profile.component.html',
  styleUrls: ['./my-edit-profile.component.css']
})
export class MyEditProfileComponent {
  user: any;
  Edituser :any
  errMessage: any;

  constructor(private accountService: MyAccountService) {
    this.accountService.getUser().subscribe({
      next: (data) => {
        this.user = data;
        this.Edituser = { ...data }; // make a copy of the user object
        console.log(this.Edituser);
      },
      error: (err) => {
        this.errMessage = err;
      }
    });
  }

  putUser() {
    this.accountService.putUser(this.Edituser).subscribe({
      next: (data) => {
        this.user = this.Edituser;
        console.log(this.user);
      },
      error: (err) => {
        this.errMessage = err;
      }
    });
  }

  OnClick() {
    this.putUser()
  }
  getUserDateOfBirth() {
    const dateOfBirth = new Date(this.user.DateOfBirth);
    const year = dateOfBirth.getFullYear();
    const month = (dateOfBirth.getMonth() + 1).toString().padStart(2, '0');
    const day = dateOfBirth.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  @Input()
  requiredFileType:any;
  fileName = '';
  uploadProgress:number=0;
  uploadSub: Subscription=new Subscription();
  onFileSelected(event:any) {
    let me = this;
    let file = event.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.user.Image = reader.result!.toString();
      };
      reader.onerror = (error) => {
        console.log('Error: ', error);
      };
    }
    this.user.Image=this.fileName
  }
  cancelUpload() {
    this.uploadSub.unsubscribe();
  this.reset();
  }
  reset() {
  this.uploadProgress = 0;
  this.uploadSub = new Subscription();
  }
}
