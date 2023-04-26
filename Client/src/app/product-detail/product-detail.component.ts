import { Component } from '@angular/core';
import { ProductAPIService } from '../product-api.service';
import { Product } from '../models/Product';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  product:Product | undefined;
  errMessage:string=''
  constructor(private _service: ProductAPIService){
  }
  searchProduct(_id:string)
  {
  this._service.getProduct(_id).subscribe({
  next:(data)=>{this.product=data},
  error:(err)=>{this.errMessage=err}
  })
  }
}
