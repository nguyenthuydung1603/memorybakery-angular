import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { faDeleteLeft, faEdit, faFilter, faInfoCircle, faPlus, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import swal from '../custom-function/swal2';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css']
})
export class CustomerManagementComponent {
  // pagination & sort & search
  totalPage: any = [];
  totalItem: any;
  page: number = 1;
  perPage: number = 10;
  search: string = '';
  sortBy: string = '';
  orderBy: string = '';
  isLoading = false;
  isSelectedSort: string = '';
 showSelectedSort: boolean= false;
  //
  customers: any;
  errMessage:any
  totalOrders:number=0;
  totalOrderValue:number=0;
  selectedCustomer:any;
  showDetail = false;
  isShowModelSort = false
    // orther
  faPlus = faPlus
  faFilter = faFilter
  faSearchPlus = faSearchPlus
  faEdit = faInfoCircle
  faDelete = faDeleteLeft
  listSort: Array<string> = [
    'Tên (A -> Z)', 'Tên (Z -> A)','Đơn hàng'
  ];

  constructor(private activateRoute:ActivatedRoute, private accountService: CustomerService) {

    this.getUsers();
  }

  closeModal(){
    if(this.isSelectedSort==="Đơn hàng") {
      this.isShowModelSort=false
    }
  }

  getUsers() {
     this.isLoading = true;
    this.accountService.getCustomerList(this.page, this.sortBy, this.orderBy, this.search, this.perPage).subscribe({
      next: (data) => {
        if (data.data.length == 0) {
          this.page = 1
          this.getUsers()
        }
        this.customers = data.data
        this.totalItem = data.totalItem
        this.isLoading = false

        let pageTmp = Math.ceil(this.totalItem / this.perPage)
        this.totalPage = Array(pageTmp)
        this.totalOrders = 0;
        this.totalOrderValue = 0;

        this.customers.forEach((c: any) => {
          let orderValue = 0;
          c.Order.forEach((o: any) => {
            if (o.OrderStatus !== 'Đã huỷ') { // Exclude canceled orders
              orderValue += parseInt(o.SubTotal, 10);
            }
          });
          c.orderValue = orderValue;
          this.totalOrders += c.Order.length; // Count total orders excluding canceled ones
          this.totalOrderValue += orderValue; // Sum order values excluding canceled orders
        });
      },
      error: (err) => {
        this.errMessage = err
        this.isLoading = false
      }
    })
    this.isLoading = false
  }
  public submitForm() {
    this.page = 1
    this.getUsers();
    this.search = '';
  }
  paginateIcon(type: any) {
    switch (type) {
      case 'pre': {
        this.page -= 1
        if (this.page < 1) this.page = 1
        this.getUsers()
        break
      }
      case 'next': {
        this.page += 1
        if (this.page > this.totalPage.length) this.page = 1
        this.getUsers()
        break
      }
    }
  }

  paginate(page: any) {
    this.page = page
    this.getUsers()
  }
  selectOption(item: string) {
    this.isSelectedSort = item
    this.isShowModelSort = true
    switch (item) {
      case 'Tên (A -> Z)': {
        this.sortBy = 'name'
        this.orderBy = 'asc'
        break
      }
      case 'Tên (Z -> A)': {
        this.sortBy = 'name'
        this.orderBy = 'desc'
        break
      }
    }
    this.getUsers()
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
    const dateOfBirth = new Date(this.selectedCustomer.DateOfBirth);
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
    this.closeModal();
  }
}
formatOrderId(orderId: string): string {
  return 'Memory' + orderId.slice(-3);
}

deleteUser(id: any) {
  this.accountService.deleteUser(id).subscribe({
    next: (data) => {
      this.getUsers();
      swal.success(data.message ?? 'Đã xoá thành công', 3000)
    },
    error: (err) => {
      swal.error(err)
    }
  })
}

public handleDismiss(dismissMethod: any): void {
}

}
