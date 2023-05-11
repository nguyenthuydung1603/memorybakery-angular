import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderAPIService } from '../order-api.service';
import { IOrder, Order } from '../models/Order';
import { functionCustom } from '../custom-function/functionCustom';
import swal from '../custom-function/swal2';

@Component({
  selector: 'app-chi-tiet-don-hang',
  templateUrl: './chi-tiet-don-hang.component.html',
  styleUrls: ['./chi-tiet-don-hang.component.css']
})
export class ChiTietDonHangComponent {

  orderDetail!: IOrder
  sumPriceOfProduct: number = 0
  finalAmountPaid: any
  amountOwed: any
  curStatusType: any
  isShow: boolean = false
  isShowCancel: boolean = false
  order = new Order()
  constructor(private router: Router, private service: OrderAPIService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getDetail()
  }

  getDetail() {
    let id = this.route.snapshot.paramMap.get('id')
    this.service.getAOrder(id).subscribe({
      next: (data) => {
        this.orderDetail = data
        this.order = data
        this.orderDetail.Details.map((or: any) => {
          let tmp = 0
          tmp = or.Quantity * or.UnitPrice
          this.sumPriceOfProduct += tmp
        })
        this.actionType()
        this.amountPaid()
      }
    })
  }

  convertDate(date: any) {
    return functionCustom.convertDate(date)
  }

  convertVND(price: any) {
    return functionCustom.convertVND(price)
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

  changeOrderStatus(event: any, type: any) {

    switch (type) {
      case 'Xác nhận đơn hàng':
        this.order.OrderStatus = 'Đang giao'
        break;
      case 'Đã giao':
        this.order.OrderStatus = 'Đã giao'
        break;

      default:
        this.order.OrderStatus = 'Đã huỷ'
        break
    }

    if (event != null) this.order.Reason = event
    this.service.putOrder(this.order).subscribe({
      next: (data) => {
        swal.success(`${type} thành công`, 3000)
        this.router.navigate([`/quanlydonhang`])
      },
      error: (err) => {
        swal.error(err)
      }
    })

  }

  handleDismiss(e: any) { }
}
