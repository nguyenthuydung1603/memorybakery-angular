import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css']
})
export class CustomerManagementComponent {
  pageSize = 1;
  currentPage = 1;
  totalCustomers =2;
}
