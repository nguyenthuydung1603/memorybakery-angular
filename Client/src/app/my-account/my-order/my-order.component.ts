import { Component } from '@angular/core';
import { MyAccountService } from 'src/app/services/my-account.service';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent {
  user: any;
  orders: any[] = [];
  errMessage:any
  buttonLabel:string=""
  selectedStatus: string = 'Tất cả';
  statusOptions: any[] = []
  filteredOrders: any[] = []; // tạo biến lưu trữ danh sách các đơn hàng đã được lọc

  constructor(private accountService: MyAccountService) {
    this.accountService.getOrderStatus().subscribe({
      next: (data) => {
        console.log('Data from getOrderStatus:', data);
        this.statusOptions = data;
        this.filterOrders('Tất cả');
      },
      error: (err) => {
        this.errMessage = err;
      }
    }),
    this.accountService.getUser().subscribe({
      next: (data) => {
        this.user = data;
        this.orders = data.Order;
        this.filteredOrders = this.orders.filter(order => order.OrderStatus === this.selectedStatus || this.selectedStatus === 'Tất cả');
        console.log(this.orders)
      },
      error: (err) => {
        this.errMessage = err;
      }
    })
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  filterOrders(status: string): void {
    this.selectedStatus = status;
    this.filteredOrders = this.orders.filter(order => order.OrderStatus === this.selectedStatus || this.selectedStatus === 'Tất cả');
}
getButtonLabel(order: any): string {
  if (order.OrderStatus === 'Đã giao'||order.OrderStatus === 'Đã huỷ') {
    return 'Mua lại';
  } else if (order.OrderStatus === 'Chờ xác nhận') {
    return 'Huỷ đơn';
  }else if (order.OrderStatus === 'Đang giao') {
    return 'Xem chi tiết';
  } else {
    return "";
  }
}
formatOrderId(orderId: string): string {
  return '#MLB' + orderId.slice(-3);
}

}
