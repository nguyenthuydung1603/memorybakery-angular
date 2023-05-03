import { Component } from '@angular/core';
import { ProductAPIService } from '../product-api.service';
import { Product } from '../models/Product';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  product:any;
  id:any
  errMessage:string=''
  constructor(public _cart: CartService,private _service: ProductAPIService,private _route:ActivatedRoute){
  }
  ngOnInit():void{
    this.id =this._route.snapshot.params.id;
    this._service.getProduct(this.id).subscribe({
      next:(data)=>{this.product=data},
      error:(err)=>{this.errMessage=err}
    })
  }
  addToCart(p:any)
  {
    this._cart.addToCart(p)
  alert("Bạn đã thêm sản phẩm thành công");
}
}
