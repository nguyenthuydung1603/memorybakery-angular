import { Component, HostListener } from '@angular/core';
import { IUser, User } from '../models/User';
import { faPlus, faFilter, faSearchPlus, faEdit, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import swal from '../custom-function/swal2';
import { functionCustom } from '../custom-function/functionCustom';
import { SettingService } from '../services/setting.service';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent {

  //paginate
  page: number = 1
  perPage: number = 10
  totalPage: any = []
  totalItem: any

  isShow: boolean = false
  isCreate: boolean = false
  isUpdate: boolean = false
  listRole: any = [{
    RoleName: 'Admin',
    selected: false
  }, {
    RoleName: 'QLKH',
    selected: false
  }, {
    RoleName: 'QLĐH',
    selected: false
  }, {
    RoleName: 'QLBlog',
    selected: false
  }, {
    RoleName: 'QLSP',
    selected: false
  }, {
    RoleName: 'QLKM',
    selected: false
  }]

  faSearch = faSearchPlus
  faEdit = faEdit
  faDelete = faDeleteLeft

  searchText: string = ''
  user!: IUser
  selectedUser = new User()
  listStaff: any
  // listRoleSelected: Array<any> = []

  constructor(private service: SettingService) {
    this.getList()
    this.getUser()
  }


  getUser() {
    let user: any = sessionStorage.getItem('user')
    if (user) this.user = JSON.parse(user)
  }


  getList() {
    this.service.getStaffList(this.page, this.searchText, this.perPage).subscribe({
      next: (data) => {
        this.listStaff = data.data
        this.totalItem = data.totalItem
        let pageTmp = Math.ceil(+this.totalItem / +this.perPage)
        this.totalPage = Array(pageTmp)

      },
      error: (err) => {
        swal.error(err)
      }
    })
  }

  actionCreate() {
    let checkAdmin = false
    if (this.user) {
      this.user.UserType.Role.map((role: any) => {
        if (role.RoleName == 'Admin') checkAdmin = true
      })
    }
    if (!checkAdmin) return swal.error('Chỉ có Admin mới có quyền thực hiện hành động này!')
    this.resetUser()
    this.resetListRole()
    this.isCreate = true
    this.isShow = true
  }

  actionUpdate(user: any) {
    let checkAdmin = false
    if (this.user) {
      this.user.UserType.Role.map((role: any) => {
        if (role.RoleName == 'Admin') checkAdmin = true
      })
    }
    if (!checkAdmin) return swal.error('Chỉ có Admin mới có quyền thực hiện hành động này!')
    this.resetListRole()
    this.isShow = true
    this.isUpdate = true
    this.selectedUser = functionCustom.cloneObject(user)

    for (let i = 0; i < this.listRole.length; i++) {
      for (let j = 0; j < this.selectedUser.UserType.Role.length; j++) {
        if (this.listRole[i].RoleName == this.selectedUser.UserType.Role[j].RoleName) {
          this.listRole[i].selected = true
        }
      }
    }
  }

  actionCancel() {
    this.isCreate = false
    this.isUpdate = false
    this.isShow = false
  }

  submitForm() {
    this.page = 1 //cái này của phân trang
    this.getList()
  }

  resetList() {
    this.searchText = ''
    this.getList()
  }

  handleDismiss(e: any) { }


  createUser() {
    this.selectedUser.UserType.TypeName = 'Staff'
    this.selectedUser.UserType.Role = []
    this.listRole.map((role: any) => {
      if (role.selected == true) this.selectedUser.UserType.Role.push({ RoleName: role.RoleName })
    })
    if (this.selectedUser.UserType.Role.length == 0) return swal.error('Phải chọn ít nhất 1 vai trò cho người dùng!', 3500)
    if (this.selectedUser.UserName == '' || this.selectedUser.Password == '') return swal.error('Phải nhập đầy đủ thông tin để thực hiện hành động này', 3500)

    this.service.postAStaff(this.selectedUser).subscribe({
      next: (data) => {
        swal.success('Tạo mới thành công 1 người dùng')
        this.actionCancel()
        this.getList()
      },
      error: (err) => swal.error(err)
    })
  }

  editUser() {
    this.selectedUser.UserType.Role = []
    this.listRole.map((role: any) => {
      if (role.selected == true) this.selectedUser.UserType.Role.push({ RoleName: role.RoleName })
    })
    if (this.selectedUser.UserType.Role.length == 0) return swal.error('Phải chọn ít nhất 1 vai trò cho người dùng!', 3500)
    if (this.selectedUser.UserName == '' || this.selectedUser.Password == '') return swal.error('Phải nhập đầy đủ thông tin để thực hiện hành động này', 3500)
    this.service.putAStaff(this.selectedUser).subscribe({
      next: (data) => {
        this.resetListRole()
        this.getList()
        this.actionCancel()
        swal.success('Chỉnh sửa quyền cho người dùng thành công')
      },
      error: (er) => {
        swal.error(er)
      }
    })
  }

  deleteUser(u: any) {
    this.service.deleteStaff(u._id).subscribe({
      next: (data) => {
        this.getList()
        swal.success('Đã xoá thành công người dùng', 2500)
      },
      error: (err) => swal.error(err)
    })

  }

  paginate(curPage: any) {
    this.page = curPage
    this.getList()
  }

  paginateIcon(type: any) {
    switch (type) {
      case 'next': {
        this.page += 1
        if (this.page > this.totalPage.length) {
          this.page = 1
          this.getList()
        } else this.getList()
        break
      }
      case 'pre': {
        this.page -= 1
        if (this.page == 0) {
          this.page = 1
          return
        }
        else this.getList()
        break
      }
    }
  }

  onChangeRole(roleSelected: any) {
    this.listRole.map((role: any) => {
      if (roleSelected.RoleName == role.RoleName) {
        roleSelected.selected = !roleSelected.selected
        return
      }
    })
  }

  resetUser() {
    this.selectedUser._id = ''
    this.selectedUser.FullName = '',
      this.selectedUser.Gender = '',
      this.selectedUser.DateOfBirth = '',
      this.selectedUser.Phone = '',
      this.selectedUser.Image = '',
      this.selectedUser.UserName = '',
      this.selectedUser.Password = '',
      this.selectedUser.salt = '',
      this.selectedUser.CreateDate = '',
      this.selectedUser.UserType = {},
      this.selectedUser.Cart = [],
      this.selectedUser.Order = [],
      this.selectedUser.Product = [],
      this.selectedUser.Address = [],
      this.selectedUser.Voucher = []
  }

  resetListRole() {
    this.listRole = [{
      RoleName: 'Admin',
      selected: false
    }, {
      RoleName: 'QLKH',
      selected: false
    }, {
      RoleName: 'QLĐH',
      selected: false
    }, {
      RoleName: 'QLBlog',
      selected: false
    }, {
      RoleName: 'QLSP',
      selected: false
    },
    {
      RoleName: 'QLKM',
      selected: false
    }]
  }

  // Đóng Modal khi click ra ngoài phạm vi của Modal
@HostListener('document:click', ['$event'])
public onClick(event: any): void {
  if (event.target.classList.contains('fog')) {
    this.actionCancel();
  }
}
}

