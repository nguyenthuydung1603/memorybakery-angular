import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, retry, catchError, throwError } from 'rxjs';
import { IUser } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  API_URL: string = 'http://localhost:6868'

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

  constructor(private _http: HttpClient) { }
  getCustomerList(page: any, sortBy: any, orderBy: any, search: any, perPage: any): Observable<any> {
    if (!page) page = 1;
    if (!sortBy) sortBy = '';
    if (!orderBy) orderBy = '';
    if (!search) search = '';
    if (!perPage) perPage = '';

    return this._http.get<any>(`${this.API_URL}/customer-admin?page=${page}&sortBy=${sortBy}&orderBy=${orderBy}&search=${search}&perPage=${perPage}`, this.requestOptions).pipe(
      map(res => JSON.parse(res) as Array<IUser>),
      retry(3),
      catchError(this.handleError)
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
    return this._http.get<any>("http://localhost:6868/customer-admin/"+_id,requestOptions).pipe(
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
  return this._http.delete<any>("http://localhost:6868/customer-admin/"+_id,requestOptions).pipe(
      map(res=>JSON.parse(res)),
      retry(3),
      catchError(this.handleError))
  }

  // Reset pass
  resetPassWord(id: string): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "application/json;charset=utf-8");
    const requestOptions: Object = {
      headers: headers,
      responseType: "text"
    };

    const body = {
      _id: id // Truyền _id nhận từ component vào body
    };

    return this._http.put<any>("http://localhost:6868/customer-admin/resetPassword", body, requestOptions)
      .pipe(
        map(res => JSON.parse(res)),
        retry(3),
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }


}
