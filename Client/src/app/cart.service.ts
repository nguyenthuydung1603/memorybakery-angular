import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { Product } from './models/Product';
import { BehaviorSubject, Observable, catchError, map, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  listInCart: any = []
  subTotal: any = 0
  @Input() data: any;
  constructor(private _http: HttpClient) { }
  private messageSource = new BehaviorSubject<string>("");
  currentMessage = this.messageSource.asObservable();
  changeMessage(message: string) {
    this.messageSource.next(message);
  }
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
  putCart(aUser:any):Observable<any>
  {
    const token = localStorage.getItem('token');
  const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
  const requestOptions:Object={
  headers:headers,
  responseType:"text"
  }
  return this._http.put<any>("/cart/"+token,JSON.stringify(aUser),requestOptions).pipe(
  map(res=>JSON.parse(res) as Array<Product>),
  retry(3),
  catchError(this.handleError))
  }
  addToCart(p: any) {
    let cart = localStorage.getItem('cart')
    let listProduct = []
    let isIncrease = false
    if (!cart) {
      p.qty = 1
      p.size= p.Variant[0]
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
        p.size= p.Variant[0]
        listProduct.push(p)
      }
    }
    localStorage.setItem('cart', JSON.stringify(listProduct))
  }
  }


