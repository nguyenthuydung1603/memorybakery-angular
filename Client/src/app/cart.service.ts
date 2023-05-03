import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { Product } from './models/Product';
import { Observable, catchError, map, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  listInCart: any = []
  subTotal: any = 0
  @Input() data: any;
  constructor(private _http: HttpClient) { }
  postCart(aProduct:any):Observable<any>
  {
  const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
  const requestOptions:Object={
  headers:headers,
  responseType:"text"
  }
  return this._http.post<any>("/cart",JSON.stringify(aProduct),requestOptions).pipe(
  map(res=>JSON.parse(res)as Array<Product>),
  retry(3),
  catchError(this.handleError))
  }
  handleError(error:HttpErrorResponse){
    return throwError(()=>new Error(error.message))
  }
  getCart():Observable<any>
  {
  const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
  const requestOptions:Object={
  headers:headers,
  responseType:"text"
  }
  return this._http.get<any>("/cart",requestOptions).pipe(
  map(res=>JSON.parse(res)),
  retry(3),
  catchError(this.handleError))
  }

  addToCart(p: any) {
    let cart = localStorage.getItem('cart')
    let listProduct = []
    let isIncrease = false
    if (!cart) {
      p.qty = 1
      listProduct.push(p)
      localStorage.setItem('cart', JSON.stringify(listProduct))
    } else {
      listProduct = JSON.parse(cart)
      listProduct.map((pro: any) => {
        if (pro._id == p._id) {
          pro.qty++
          isIncrease = true
          return
        }
      })
      if (isIncrease == false) {
        p.qty = 1
        listProduct.push(p)
      }
    }
    localStorage.setItem('cart', JSON.stringify(listProduct))
  }
  showCart() {
    let cart: any = localStorage.getItem('cart')
    this.listInCart = JSON.parse(cart)

    let listItem
    if (this.listInCart) listItem = [...this.listInCart]
    this.subTotal = 0
    listItem?.map((p: any) => {
      let totalTmp = p.price * p.qty
      this.subTotal += totalTmp
    })
  }
  }


