import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { IOrder } from '../models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderAPIService {
  constructor(private _http: HttpClient) { }

  API_URL: any = 'http://localhost:6868'

  headers = new HttpHeaders().set('Content-Type', 'text/plain;charset=utf-8')
  requestOptions: Object = {
    header: this.headers,
    responseType: 'Text'
  }

  headers2 = new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8')
  requestOptions2: Object = {
    header: this.headers2,
    responseType: 'Text'
  }


  getOrders(page: any, perPage: any, status:any): Observable<any> {
    return this._http.get<any>(`${this.API_URL}/orders?page=${page}&perPage=${perPage}&status=${status}`, this.requestOptions).pipe(
      map(res => JSON.parse(res) as Array<IOrder>),
      retry(3),
      catchError(this.handleError)
    )
  }

  getOrderStatus(OrderStatus: any): Observable<any> {
    return this._http.get<any>(`${this.API_URL}/orders/${OrderStatus}`, this.requestOptions).pipe(
      map(res => JSON.parse(res) as Array<IOrder>),
      retry(3),
      catchError(this.handleError)
    )
  }

  getAOrder(orderId: any): Observable<any> {
    return this._http.get<any>(`${this.API_URL}/order-detail/${orderId}`, this.requestOptions).pipe(
      map(res => JSON.parse(res) as IOrder),
      retry(3),
      catchError(this.handleError)
    )
  }
  postAOrder(product: any): Observable<any> {
    return this._http.post<any>(`${this.API_URL}/order`, product).pipe(
      map(res => res),
      retry(3),
      catchError(this.handleError)
    )
  }

  putOrder(order: any): Observable<any> {
    return this._http.put<any>(`${this.API_URL}/order/${order._id}`, order).pipe(
      map(res => res),
      retry(3),
      catchError(this.handleError)
    )
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message))
  }
}
