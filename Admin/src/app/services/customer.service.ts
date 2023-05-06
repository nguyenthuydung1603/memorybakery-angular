import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, retry, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private _http: HttpClient) { }
  // Hàm get tất cả Fashions,sắp xếp theo ngày tạo giảm dần
 getCustomers(): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=utf-8");
    const requestOptions: Object = {
      headers: headers,
      responseType: "text"
    }
    return this._http.get<any>("http://localhost:6868/customer-admin", requestOptions).pipe(
      map(res=>JSON.parse(res)),
      retry(3),
      catchError(this.handleError)
    )
  }
  // Hàm get Id
  getCustomer(_id:string):Observable<any>
  {
    const headers=new HttpHeaders().set("Content-Type","text/plain;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType:"text"
    }
    return this._http.get<any>("/customer-admin/"+_id,requestOptions).pipe(
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
  return this._http.delete<any>("/customer-admin/"+_id,requestOptions).pipe(
      map(res=>JSON.parse(res)),
      retry(3),
      catchError(this.handleError))
  }
  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}
