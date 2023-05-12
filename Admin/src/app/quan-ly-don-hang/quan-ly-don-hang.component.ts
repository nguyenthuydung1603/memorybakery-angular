import { Component, HostListener } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor/public-api';
import { Router } from '@angular/router';
import { faDeleteLeft, faInfoCircle, faFilter, faPlus, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { functionCustom } from '../custom-function/functionCustom';
import { IOrder, Order } from '../models/Order';
import swal from '../custom-function/swal2';
import { OrderAPIService } from '../services/order-api.service';

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
  orderDetail!: IOrder
  sumPriceOfProduct: number = 0
  finalAmountPaid: any
  amountOwed: any
  curStatusType: any
  isShow: boolean = false
  isShowCancel: boolean = false
  order = new Order()
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

  isCreate = false
  isUpdate = false
  isVarian = false
  isLoading = false

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

  showDetail:boolean=false;
  selectedOrder:any
  showOrderDetail(order: any) {
    this.selectedOrder = order;
    this.orderDetail = this.selectedOrder
    this.showDetail = true;
    this.orderDetail.Details.map((or: any) => {
      let tmp = 0
      tmp = or.Quantity * or.UnitPrice
      this.sumPriceOfProduct += tmp
    })
    this.actionType()
    this.amountPaid()
  }
  convertDate(date: any) {
    return functionCustom.convertDate(date)
  }

  total() {
    let costShip: number = this.orderDetail ? +this.orderDetail.CostShip : 0
    return functionCustom.convertVND(this.sumPriceOfProduct + costShip)
  }

  actionType() {
    switch (this.orderDetail.OrderStatus) {
      case 'Đã giao': {
        this.curStatusType = 'Đã giao'
        this.isShow = false
        this.isShowCancel = false
        break
      }
      case 'Đã huỷ': {
        this.curStatusType = 'Đã huỷ'
        this.isShow = false
        this.isShowCancel = false
        break
      }
      case 'Chờ xác nhận': {
        this.curStatusType = 'Xác nhận đơn hàng'
        this.isShow = true
        this.isShowCancel = true
        break
      }
      case 'Đang giao': {
        this.curStatusType = 'Đã giao'
        this.isShow = true
        this.isShowCancel = true
        break
      }
    }
  }

  amountPaid() {
    if (this.orderDetail.OrderStatus == 'Đã huỷ') {
      this.finalAmountPaid = '0 VND'
      this.amountOwed = '0 VND'
      return
    }

    if (this.orderDetail.PaymentMethod == 1 && (this.orderDetail.OrderStatus == 'Đã giao' || this.orderDetail.OrderStatus == 'Đang giao')) {
      this.finalAmountPaid = this.total()
      this.amountOwed = '0 VND'
    }

    if (this.orderDetail.PaymentMethod == 1 && this.orderDetail.OrderStatus == 'Chờ xác nhận') {
      this.finalAmountPaid = '0 VND'
      this.amountOwed = this.total()
    }

    if (this.orderDetail.PaymentMethod == 0 && (this.orderDetail.OrderStatus == 'Đang giao' || this.orderDetail.OrderStatus == 'Chờ xác nhận')) {
      this.finalAmountPaid = '0 VND'
      this.amountOwed = this.total()
    }

    if (this.orderDetail.PaymentMethod == 0 && this.orderDetail.OrderStatus == 'Đã giao') {
      this.finalAmountPaid = this.total()
      this.amountOwed = '0 VND'
    }
  }
  formattedDeliveryTime: string="";
  changeOrderStatus(event: any, type: any) {

    switch (type) {
      case 'Xác nhận đơn hàng':
        this.selectedOrder.OrderStatus = 'Đang giao'
        break;
      case 'Đã giao':
        this.selectedOrder.OrderStatus = 'Đã giao'
        break;

      default:
        this.selectedOrder.OrderStatus = 'Đã huỷ'
        break
    }

    if (event != null) this.selectedOrder.Reason = event
    this._service.putOrder(this.selectedOrder).subscribe({
      next: (data) => {
        swal.success(`${type} thành công`, 3000),
        this.closeOrderDetail();

      },
      error: (err) => {
        swal.error(err)
      }
    })

  }

  handleDismiss(e: any) { }

  closeOrderDetail() {
    this.showDetail = false;
  }
  @HostListener('document:click', ['$event'])
public onClick(event: any): void {
  if (event.target.classList.contains('modal')) {
    this.closeOrderDetail();
  }
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
