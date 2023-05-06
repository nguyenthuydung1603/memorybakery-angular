import { Component } from '@angular/core';
import { MyAccountService } from 'src/app/services/my-account.service';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent {
  orders: any;
  errMessage:any;
  statusOptions = ["Tất cả", "Chờ xác nhận", "Đang giao hàng", "Đã giao", "Đã huỷ"]
  filteredOrders: any[] = []; // tạo biến lưu trữ danh sách các đơn hàng đã được lọc
  selectedStatus: string = 'Tất cả';
  buttonLabel:string=""


  constructor(private accountService: MyAccountService) {
    this.getListOrder();
  }
  getListOrder() {
    this.accountService.getListOrder().subscribe({
      next: (data) => {
        this.orders=data
        this.filteredOrders = this.orders.filter((order: { OrderStatus: string; }) => order.OrderStatus === this.selectedStatus || this.selectedStatus === 'Tất cả');
      },
      error: (err) => {
        this.errMessage = err;
        console.log(this.errMessage)
      }
    })
  }
  // Hàm này để chuyển đổi trang thái của Order, bấm qua từng Status thì chỉ hiện Order có Status đó thôi
  filterOrders(status: string): void {
    this.selectedStatus = status;
    this.filteredOrders = this.orders.filter((order: { OrderStatus: string; }) => order.OrderStatus === this.selectedStatus || this.selectedStatus === 'Tất cả');
  }

  // Nếu Order Status là Đã giao và Đã huỷ --> Button có tên Mua lại
  // Nếu Order Status là "Chờ xác nhận" --> Button có tên là Huỷ Đơn
  // Nếu Order Status là "Đang giao" --> Button có tên Xem chi tiết đơn hàng
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
  // Hàm cắt ký tự và hiển thị giá trị đơn hàng
  formatOrderId(orderId: string): string {
    return '#MLB' + orderId.slice(-3);
  }

}
