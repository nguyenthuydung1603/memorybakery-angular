import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { IUser } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
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

  getStaffList(page: any, search: any, perPage: any): Observable<any> {
    if (!page) page = 1
    if (!search) search = ''
    if (!perPage) perPage = ''
    return this._http.get<any>(`${this.API_URL}/staffs?page=${page}&search=${search}&perPage=${perPage}`, this.requestOptions).pipe(
      map(res => JSON.parse(res) as Array<IUser>),
      retry(3),
      catchError(this.handleError)
    )
  }

  getAStaff(staffId: any): Observable<any> {
    return this._http.get<any>(`${this.API_URL}/staff/` + staffId, this.requestOptions).pipe(
      map(res => JSON.parse(res) as IUser),
      retry(3),
      catchError(this.handleError)
    )
  }
  postAStaff(staff: any): Observable<any> {
    return this._http.post<any>(`${this.API_URL}/staffs`, staff).pipe(
      map(res => res),
      retry(3),
      catchError(this.handleError)
    )
  }

  changePassword(user: any, param:any): Observable<any> {
    return this._http.post<any>(`${this.API_URL}/change-pass-admin/${user._id}`, param).pipe(
      map(res => res),
      retry(3),
      catchError(this.handleError)
    )
  }


  putAStaff(staff: any): Observable<any> {
    return this._http.put<any>(`${this.API_URL}/staffs/${staff._id}`, staff).pipe(
      map(res => res),
      retry(3),
      catchError(this.handleError)
    )
  }

  deleteStaff(staffId: any): Observable<any> {
    return this._http.delete<any>(`${this.API_URL}/staffs/` + staffId, this.requestOptions2).pipe(
      map(res => res),
      retry(3),
      catchError(this.handleError)
    )
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message))
  }
}
