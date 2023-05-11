import { Component } from '@angular/core';
import { OrderAPIService } from '../order-api.service';
import { AngularEditorConfig } from '@kolkov/angular-editor/public-api';
import { Router } from '@angular/router';
import { faDeleteLeft, faInfoCircle, faFilter, faPlus, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { functionCustom } from '../custom-function/functionCustom';

@Component({
  selector: 'app-quan-ly-don-hang',
  templateUrl: './quan-ly-don-hang.component.html',
  styleUrls: ['./quan-ly-don-hang.component.css']
})
export class QuanLyDonHangComponent {
  orderstatus: string = "";
  orderstatuss = ['Sắp xếp theo', 'Chờ xác nhận', 'Đang giao', 'Đã giao', 'Đã huỷ']
  orders: any;
  errMessage: string = ''
  constructor(public _service: OrderAPIService, private router: Router) {
    this.getList();
  }
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

  selectedStatus: any = 'Sắp xếp theo'
  faPlus = faPlus
  faFilter = faFilter
  faSearchPlus = faSearchPlus
  faEdit = faInfoCircle
  faDelete = faDeleteLeft
  isShow = false
  isCreate = false
  isUpdate = false
  isVarian = false
  isLoading = false
  showDetail=false

  //paginate
  page: number = 1
  perPage: number = 12
  totalPage: any = []
  totalItem: any


  getList() {
    let status = this.selectedStatus
    if (status == 'Sắp xếp theo') status = ''
    this._service.getOrders(this.page, this.perPage, status).subscribe({
      next: (data) => {
        this.orders = data.data
        this.totalItem = data.totalItem
        let pageTmp = Math.ceil(this.totalItem / this.perPage)
        this.totalPage = Array(pageTmp)
      },
      error: (err) => { this.errMessage = err }
    })
  }

  public submitForm() {
    this.isLoading = true
    setTimeout(() => {
      this.isLoading = false
    }, 2000)

  }

  public submitVarian() { }

  public isShowVarian(id: any) {
    this.isVarian = true
  }

  public actionAdd() {
    this.isShow = true
    this.isCreate = true
  }

  public actionUpdate(id: any) {
    this.isShow = true
    this.isUpdate = true
  }

  public actionCancel() {
    this.isCreate = false
    this.isShow = false
    this.isVarian = false
    this.isUpdate = false
  }
  reset() {
    this.page = 1
    this.perPage = 12
    this.selectedStatus = 'Sắp xếp theo'
    this.getList()
  }

  convertLocalDate(date: any) {
    if (date) return functionCustom.convertDate(date)
    return ''
  }

  convertVND(price: any) {
    return functionCustom.convertVND(price)
  }

  getLast5Characters(code: string) {
    return code.slice(-5)
  }

  goToDetail() {
    this.showDetail=true;
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

  paginate(curPage: any) {
    this.page = curPage
    this.getList()
  }

  changeListByStatus() {
    this.page = 1
    this.getList()
  }

}
