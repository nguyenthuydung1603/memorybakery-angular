import { Component } from '@angular/core';
import { IProduct } from '../models/Product';
import { ProductAPIService } from '../product-api.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  product:IProduct[] =[] ;
  products: any;
  errMessage:string=''
  constructor(public _service: ProductAPIService){
  this._service.getProducts().subscribe({
  next:(data: IProduct[])=>{this.products=data},
  error:(err)=>{this.errMessage=err}
  })
  }
}
