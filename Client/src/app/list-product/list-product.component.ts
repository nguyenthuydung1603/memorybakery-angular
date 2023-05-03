import { Component } from '@angular/core';
import { IProduct, Product } from '../models/Product';
import { ProductAPIService } from '../product-api.service';
import { CartService } from '../cart.service';
@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent {
  product:IProduct[] =[] ;
  products: any;
  cart=[]
  Category:any;
  errMessage:string=''
  constructor(public _service: ProductAPIService,public _cart: CartService){
  this._service.getProducts().subscribe({
  next:(data: IProduct[])=>{this.products=data},
  error:(err)=>{this.errMessage=err}
  })
  }
  getListProductByCategory(Category:any){
    this._service.getListProductByCategory(Category).subscribe({
    next:(data)=>{this.products=data},
    error:(err)=>{this.errMessage=err}
    })
  }
  getListProductByPrice(minprice: string,maxprice:string){
    this._service.getListProductByPrice(minprice,maxprice).subscribe({
    next:(data)=>{this.products=data},
    error:(err)=>{this.errMessage=err}
    })
  }
  addToCart(p:any)
  {
    this._cart.addToCart(p)
  alert("Bạn đã thêm sản phẩm thành công");
}
}
