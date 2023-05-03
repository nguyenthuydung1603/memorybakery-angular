import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PromotionService } from '../services/promotion.service';
import { Promotion } from '../promotion-management/promotion';
import { AngularEditorConfig } from '@kolkov/angular-editor/public-api';
@Component({
  selector: 'app-promotion-detail',
  templateUrl: './promotion-detail.component.html',
  styleUrls: ['./promotion-detail.component.css']
})
export class PromotionDetailComponent  {
  id: any;
  promotion = new Promotion();
  promotions:any;
  errMessage:string=''
  private _service: any;
  constructor(private prodSev: PromotionService,private _route:ActivatedRoute){
}
ngOnInit():void{
  this.id =this._route.snapshot.params['id'];
  this.prodSev.getPromotion(this.id).subscribe({
    next:(data)=>{this.promotion=data},
    error:(err)=>{this.errMessage=err}
  })
}
  putPromotion()
  {
    this._service.putPromotion()(this.promotion).subscribe({
    next:(data: any)=>{this.promotions=data},
    error:(err: string)=>{this.errMessage=err}
  })
  alert("Bạn đã cập nhật "+ this.promotion._id + " thành công")
  window.location.reload()
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
  isShow = false
  isCreate = false
  isUpdate = false
  isVarian = false
  isLoading = false
  public actionAdd() {
    this.isShow = true
}
  public actionCancel() {
    this.isCreate = false
    this.isShow = false
    this.isUpdate = false
  }
}
