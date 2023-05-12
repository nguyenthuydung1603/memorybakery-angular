import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { IUser, User } from './models/User';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
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


  getProfile(uId: any): Observable<any> {
    return this._http.get<any>(`${this.API_URL}/staff/` + uId, this.requestOptions).pipe(
      map(res => JSON.parse(res) as IUser),
      retry(3),
      catchError(this.handleError)
    )
  }

  login(user: any): Observable<any> {
    return this._http.post<any>(`${this.API_URL}/login-admin`, user).pipe(
      map(res => res),
      retry(3),
      catchError(this.handleError)
    )
  }

  updateUser(user: any): Observable<any> {
    return this._http.put<any>(`${this.API_URL}/profile-admin/${user._id}`, user).pipe(
      map(res => res),
      retry(3),
      catchError(this.handleError)
    )
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message))
  }
}
