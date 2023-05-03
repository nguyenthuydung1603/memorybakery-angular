import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css']
})
export class CustomerManagementComponent {
  pageSize = 10;
  currentPage = 1;
  totalCustomers =50;
  customers: any;
  errMessage:any
  totalOrders:number=0;
  totalOrderValue:number=0;
  selectedCustomer:any;
  showDetail = false;
  constructor(private activateRoute:ActivatedRoute, private accountService: CustomerService) {
    this.activateRoute.paramMap.subscribe((paramMap: ParamMap) => {
      const _id = paramMap.get('id');
      if (_id) {
        this.accountService.getCustomer(_id).subscribe({
          next: (data) => {
            this.selectedCustomer = data;
            console.log(this.selectedCustomer)
          },
          error: (err) => {
            this.errMessage = err;
          }
        });
      }
    });
    this.getUsers();
  }

  getUsers() {
    this.accountService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data.customers;
        this.totalOrders = data.totalOrders;
        this.totalOrderValue = data.totalOrderValue;
        this.totalCustomers = data.totalCustomers;
        this.customers.forEach((c: any) => {
          let orderValue = 0;
          c.Order.forEach((o: any) => {
            orderValue += parseInt(o.SubTotal, 10);
          });
          c.orderValue = orderValue;
        });
        this.sortByTotalOrders(); // sắp xếp theo số order giảm dần
      },
      error: (err) => {
        this.errMessage = err;
      }
    });
  }

  sortByTotalOrders(): void {
    this.customers.sort((a: any, b: any) => {
      return b.Order.length - a.Order.length;
    });
  }

  sortByTotalOrderValue(): void {
    this.customers.sort((a: any, b: any) => {
      let totalA = 0;
      let totalB = 0;
      a.Order.forEach((order: any) => {
        totalA += parseInt(order.SubTotal, 10);
      });
      b.Order.forEach((order: any) => {
        totalB += parseInt(order.SubTotal, 10);
      });
      return totalB - totalA;
    });
  }
  onSortChange(event: any): void {
    const value = event.target.value;
    if (value === "totalOrders") {
      this.sortByTotalOrders();
    } else if (value === "totalOrderValue") {
      this.sortByTotalOrderValue();
    }
    // Thêm đoạn code sau để sắp xếp lại mảng customers
    if (this.selectedFilterOption) {
      this.filterCustomers();
    }
  }
  selectedFilterOption: string = '';
  selectedSortOrder: string = 'asc';


  onFilterOptionChange() {
    this.selectedSortOrder = 'asc';
    // Thêm đoạn code sau để lọc lại danh sách khách hàng
    if (this.selectedFilterOption) {
      this.filterCustomers();
    }
  }


  onSortOrderChange() {
    if (this.selectedSortOrder === 'asc') {
      this.customers.reverse();
    }
    // Thêm đoạn code sau để sắp xếp lại danh sách khách hàng
    if (this.selectedFilterOption) {
      this.filterCustomers();
    }
  }
  filterCustomers() {
    let filteredCustomers = [...this.customers];
    if (this.selectedFilterOption === "totalOrders") {
      filteredCustomers.sort((a: any, b: any) => {
        if (this.selectedSortOrder === 'asc') {
          return a.Order.length - b.Order.length;
        } else {
          return b.Order.length - a.Order.length;
        }
      });
    } else if (this.selectedFilterOption === "totalOrderValue") {
      filteredCustomers.sort((a: any, b: any) => {
        let totalA = 0;
        let totalB = 0;
        a.Order.forEach((order: any) => {
          totalA += parseInt(order.SubTotal, 10);
        });
        b.Order.forEach((order: any) => {
          totalB += parseInt(order.SubTotal, 10);
        });
        if (this.selectedSortOrder === 'asc') {
          return totalA - totalB;
        } else {
          return totalB - totalA;
        }
      });
    }
    this.customers = filteredCustomers;
  }
  showFilterOptions = false;

toggleFilterOptions() {
  this.showFilterOptions = !this.showFilterOptions;
}
closeFilterOptions() {
  this.showFilterOptions = false
}

  showCustomerDetail(customer: any) {
    this.selectedCustomer = customer;
    this.showDetail = true;
  }

  closeCustomerDetail() {
    this.showDetail = false;
  }
  getUserDateOfBirth() {
    const dateOfBirth = new Date(this.selectedCustomer.User.DateOfBirth);
    const year = dateOfBirth.getFullYear();
    const month = (dateOfBirth.getMonth() + 1).toString().padStart(2, '0');
    const day = dateOfBirth.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
// Đóng Modal khi click ra ngoài phạm vi của Modal
@HostListener('document:click', ['$event'])
public onClick(event: any): void {
  if (event.target.classList.contains('modal')) {
    this.closeCustomerDetail();
  }
}
formatOrderId(orderId: string): string {
  return 'Memory' + orderId.slice(-3);
}
deleteUser(id: string) {
  if (confirm("Bạn có muốn xoá?")==true)
  {
    this.accountService.deleteUser(id).subscribe({
        next: (data) => {
          this.getUsers;
          window.location.reload();
        },
        error: (err) => {
          this.errMessage = err;
        }
    })
  }

}
}
