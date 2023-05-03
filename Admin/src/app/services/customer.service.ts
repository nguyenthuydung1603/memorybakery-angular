import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, retry, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private _http: HttpClient) { }
  getCustomers(): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=utf-8");
    const requestOptions: Object = {
      headers: headers,
      responseType: "text"
    }
    return this._http.get<any>("/myList", requestOptions).pipe(
      map(res => {
        const customers = JSON.parse(res);
        let totalOrders = 0;
        let totalOrderValue = 0;
        for (const customer of customers) {
          totalOrders += customer.Order.length;
          for (const order of customer.Order) {
            totalOrderValue += parseInt(order.SubTotal, 10);
          }
        }
        return { customers, totalOrders, totalOrderValue };
      }),
      retry(3),
      catchError(this.handleError)
    ).pipe(
      // Return the observable with the additional values
      map(result => {
        const { customers, totalOrders, totalOrderValue } = result;
        return { customers, totalOrders, totalOrderValue, totalCustomers: customers.length };
      })
    );
  }
  // Hàm get Id
  getCustomer(_id:string):Observable<any>
  {
    const headers=new HttpHeaders().set("Content-Type","text/plain;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType:"text"
    }
    return this._http.get<any>("/myList/users/"+_id,requestOptions).pipe(
      map(res=>JSON.parse(res)),
      retry(3),
      catchError(this.handleError)
    )
  }
  //Delete a User
  deleteUser(_id:string):Observable<any>
  {
  const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
  const requestOptions:Object={
      headers:headers,
      responseType:"text"
  }
  return this._http.delete<any>("/myList/"+_id,requestOptions).pipe(
      map(res=>JSON.parse(res)),
      retry(3),
      catchError(this.handleError))
  }
  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}
