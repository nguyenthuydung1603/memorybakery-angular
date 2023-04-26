import { Component } from '@angular/core';
import { IProduct } from '../models/Product';
import { ProductAPIService } from '../product-api.service';
@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent {
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
