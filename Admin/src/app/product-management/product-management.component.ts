import { Component } from '@angular/core';
import { faPlus, faFilter, faSearchPlus, faEdit, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent {
  faPlus = faPlus
  faFilter = faFilter
  faSearchPlus = faSearchPlus
  faEdit = faEdit
  faDelete = faDeleteLeft
  isShow = false
  isCreate = false
  isUpdate = false
  isVarian = false
  isLoading = false


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
}
