import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faDeleteLeft, faEdit, faFilter, faPlus, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { OrderAPIService } from '../order-api.service';
import { AngularEditorConfig } from '@kolkov/angular-editor/public-api';

@Component({
  selector: 'app-quan-ly-don-hang-order-status',
  templateUrl: './quan-ly-don-hang-order-status.component.html',
  styleUrls: ['./quan-ly-don-hang-order-status.component.css']
})
export class QuanLyDonHangOrderStatusComponent {
  orderstatus:any;
  orderstatuss=["Đã giao","Đã hủy",'Chưa xác nhận',"Chưa giao", "Đã giao"]
  orders:any;
  errMessage:string=''
  constructor(private activateRoute:ActivatedRoute,public _service: OrderAPIService, private router:Router){
    activateRoute.paramMap.subscribe(
      (param)=>{
        this.orderstatus=param.get('OrderStatus')
        if(this.orderstatus!=null)
        {
          this._service.getOrderStatus(this.orderstatus).subscribe({
            next:(data)=>{this.orders=data},
            error:(err)=>{this.errMessage=err}
          })
        }
      }
    )
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
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
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
SearchOrderStatus(orderstatus:any){
  this.router.navigate(['quan-ly-don-hang-order-status',orderstatus])
}
}
