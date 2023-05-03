import { Component } from '@angular/core';
import { faPlus, faFilter, faSearchPlus, faEdit, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { AngularEditorConfig } from '@kolkov/angular-editor/public-api';
import { PromotionService } from '../services/promotion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Promotion } from './promotion';

@Component({
  selector: 'app-promotion-management',
  templateUrl: './promotion-management.component.html',
  styleUrls: ['./promotion-management.component.css']
})
export class PromotionManagementComponent {
    promotions:any;
    searchTerm: string = '';
    promotion = new Promotion();
    errMessage:string=''
    constructor(private _service: PromotionService, private http: HttpClient,private router:Router,private activateRoute:ActivatedRoute,private _fs:PromotionService){
    this._service.getPromotions().subscribe({
      next:(data)=>{this.promotions=data},
      error:(err)=>{this.errMessage=err}
    })
  }
  
    deletePromotion(_id:string){
    if (confirm("Bạn có chắc chắn xóa?")==true)
    {
    this._service.deletePromotion(_id).subscribe({
      next:(data)=>{this.promotion=data},
      error:(err)=>{this.errMessage=err}
    })
    window.location.reload()
    }
    
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

  public actionAdd() {
    this.isShow = true
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
  postPromotion()
  {
    this._service.postPromotion(this.promotion).subscribe({
    next:(data)=>{this.promotion=data},
    error:(err)=>{this.errMessage=err}
  })

    alert("Bạn đã thêm sản phẩm thành công");
  }
}
