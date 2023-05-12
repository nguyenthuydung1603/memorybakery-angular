import { Component } from '@angular/core';
import { IUser, User } from '../models/User';
import { ProfileService } from '../profile.service';
import { SettingService } from '../services/setting.service';
import swal from '../custom-function/swal2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  isShowInfo: boolean = true
  currP: any = ''
  newP: any = ''
  newPAgain: any = ''
  user = new User()

  constructor(private service: SettingService) {
    this.getDetail()
  }

  getDetail() {
    let user: any = sessionStorage.getItem('user')
    if (user) user = JSON.parse(user)

    this.service.getAStaff(user._id).subscribe({
      next: (data) => {
        this.user = data
      },
      error: (err) => swal.error(err)
    })
  }

  updateProfile() {

    this.service.putAStaff(this.user).subscribe({
      next: (data) => {
        swal.success('Chỉnh sửa thông tin cá nhân thành công')
      },
      error: (err) => swal.error(err)
    })
  }

  onFileChange(event: any) {
    if (event.target.files) {
      let reader = new FileReader()
      // nó là 1 đối tượng để xử lý các file
      // 1 đối tượng gọi đến 1 hàm
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (e: any) => {
        this.user.Image = reader.result?.toString() // chuyển từ ảnh thành đống chữ thấy gớm á
        this.updateProfile()
      }
    }
  }

  changePass() {
    if (this.newP != this.newPAgain) return swal.error('Mật khẩu mới và xác nhận mật khẩu phải trùng nhau !!!', 3000)

    if (this.newP == ''
      || this.newPAgain == ''
      || this.currP == '') return swal.error('Phải điền đầy đủ thông tin để tiếp tục !!!', 3000)

    let param = {
      newPassword: this.newP,
      password: this.currP
    }
    this.service.changePassword(this.user, param).subscribe({
      next: (data) => {
        this.currP = ''
        this.newP = ''
        this.newPAgain = ''
        this.isShowInfo = true
        swal.success(data.message)
      }, error: (err) => swal.error(err)
    })
  }
}
