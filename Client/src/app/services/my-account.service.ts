import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, retry, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyAccountService {

  constructor(private _http: HttpClient) { }
  // Hàm get User
  getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers=new HttpHeaders().set("Content-Type","text/plain;charset=utf-8")
      const requestOptions:Object={
        headers:headers,
        responseType:"json"
      }
    return this._http.get<any>("/myList/" + token, requestOptions).pipe(
      map(res => res),
      retry(3),
      catchError(this.handleError)
    )
  }
  //Service Edit Profile
  putUser(aUser: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set("Content-Type", "application/json;charset=utf-8")
                                        .set("Authorization", `Bearer ${token}`);
    const requestOptions: Object = {
      headers: headers,
      responseType: "json"
    };
    return this._http.put<any>("/myList/" + aUser.User._id, aUser, requestOptions).pipe(
      map(res => {
        // Trả về giá trị mới của user
        return res;
      }),
      retry(3),
      catchError(this.handleError)
    );
  }
  // Hàm get Order Status
  getOrderStatus(): Observable<any> {
    return this._http.get<any>("/order-status").pipe(
      map(res => res),
      retry(3),
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}
