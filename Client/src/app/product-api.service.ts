import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Product } from './models/Product';
import { IProduct } from './models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductAPIService {

  constructor(private _http: HttpClient) { }
  getProducts():Observable<any>
  {

  const headers=new HttpHeaders().set("Content-Type","text/plain;charset=utf-8")

  const requestOptions:Object={
  headers:headers,
  responseType:"text"
  }
  return this._http.get<any>("/products",requestOptions).pipe(
  map(res=>JSON.parse(res) as Array<Product>),
  retry(3),
  catchError(this.handleError))
  }
  handleError(error:HttpErrorResponse){
  return throwError(()=>new Error(error.message))
  }
  getListProductByCategory(Category: string): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=utf-8")
    const requestOptions: Object = {
      headers: headers,
      responseType: "text"
    }
    return this._http.get<any>("/products/category/" + Category, requestOptions).pipe(
      map(res => JSON.parse(res) as Array<IProduct>),
      retry(3),
      catchError(this.handleError))
  }
  getListProductByRate(rate: string): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=utf-8")
    const requestOptions: Object = {
      headers: headers,
      responseType: "text"
    }
    return this._http.get<any>("/products/rate/" + rate, requestOptions).pipe(
      map(res => JSON.parse(res) as Array<IProduct>),
      retry(3),
      catchError(this.handleError))
  }
  getListProductByPrice(minprice: string,maxprice:string): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=utf-8")
    const requestOptions: Object = {
      headers: headers,
      responseType: "text"
    }
    return this._http.get<any>("/products/price/" + minprice+'/'+maxprice, requestOptions).pipe(
      map(res => JSON.parse(res) as Array<IProduct>),
      retry(3),
      catchError(this.handleError))
  }
  getProduct(_id:string):Observable<any>
  {
  const headers=new HttpHeaders().set("Content-Type","text/plain;charset=utf-8")
  const requestOptions:Object={
  headers:headers,
  responseType:"text"
  }
  return this._http.get<any>("/products/"+_id,requestOptions).pipe(
  map(res=>JSON.parse(res) as Product),
  retry(3),
  catchError(this.handleError))
}
}
