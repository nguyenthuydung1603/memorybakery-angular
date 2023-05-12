import { Component, HostListener } from '@angular/core';
import { faPlus, faFilter, faSearchPlus, faEdit, faDeleteLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { AngularEditorConfig } from '@kolkov/angular-editor/public-api';
import { PromotionService } from '../services/promotion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Promotion } from './promotion';
import { Voucher } from '../models/Voucher';
import swal from '../custom-function/swal2';

@Component({
  selector: 'app-promotion-management',
  templateUrl: './promotion-management.component.html',
  styleUrls: ['./promotion-management.component.css']
})
export class PromotionManagementComponent {
    promotions:any;
    searchTerm: string = '';
    errMessage:string=''
    totalPage: any = [];
    totalItem: any;
    page: number = 1;
    perPage: number = 10;
    search: string = '';
    isLoading = false;
    selectedPromotion:any;
    showDetail = false;
    constructor(private _service: PromotionService, private http: HttpClient,private router:Router,private activateRoute:ActivatedRoute,private _fs:PromotionService){
      this.getPromotions();
    }
    getPromotions(){
      this._service.getPromotions(this.page, this.search, this.perPage).subscribe({
        next: (data) => {
          if (data.data.length == 0) {
            this.page = 1
            this.getPromotions()
          }
          this.promotions = data.data
          this.totalItem = data.totalItem
          this.isLoading = false

          let pageTmp = Math.ceil(this.totalItem / this.perPage)
          this.totalPage = Array(pageTmp)
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
      this.getPromotions();
      this.search = '';
    }
    paginateIcon(type: any) {
      switch (type) {
        case 'pre': {
          this.page -= 1
          if (this.page < 1) this.page = 1
          this.getPromotions()
          break
        }
        case 'next': {
          this.page += 1
          if (this.page > this.totalPage.length) this.page = 1
          this.getPromotions()
          break
        }
      }
    }

    paginate(page: any) {
      this.page = page
      this.getPromotions()
    }


    faPlus = faPlus
    faFilter = faFilter
    faSearchPlus = faSearchPlus
    faEdit = faInfoCircle
    faDelete = faDeleteLeft

  showPromotionDetail(promotion: any) {
    this.selectedPromotion = promotion;
    this.showDetail = true;
  }
  closePromotionDetail() {
    this.showDetail = false;
  }
  // Đóng Modal khi click ra ngoài phạm vi của Modal
@HostListener('document:click', ['$event'])
public onClick(event: any): void {
  if (event.target.classList.contains('modal')) {
    this.closePromotionDetail();
    this.closePromotionNew();
  }
}
  showAddPromotion:boolean=false;
  showPromotionNew() {
  this.showAddPromotion = true;
  }
  closePromotionNew() {
  this.showAddPromotion = false
  }
 promotion=new Voucher()
 formattedExpireDate: string="";
 formattedStartDate: string="";
 convertToDisplayFormat(dateString: any): any {
  const dateParts = dateString.split('-');
  return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  }

 postPromotion() {
  this.promotion.CreatedDate=new Date(Date.now())
  // Ví dụ: Lưu giá trị formattedExpireDate vào promotion.ExpireDate trước khi gửi dữ liệu lên server
  this.promotion.ExpireDate = this.convertToDisplayFormat(this.formattedExpireDate);
  this.promotion.StartDate = this.convertToDisplayFormat(this.formattedStartDate);

   this._service.postPromotion(this.promotion).subscribe({
     next: (data) => {
       this.getPromotions();
       this.showAddPromotion = false;
     },
     error: (err) => {
       this.errMessage = err;
     }
   });
 }

 deletePromotion(id: any) {
  this._service.deletePromotion(id).subscribe({
    next: (data) => {
      this.getPromotions();
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
