import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs'
import { Promotion } from '../promotion-management/promotion';
import { IPromotion } from '../promotion-management/promotion';
import { IVoucher } from '../models/Voucher';
@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  baseUrl: any;
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
  getPromotions(page: any, search: any, perPage: any): Observable<any> {
    if (!page) page = 1;
    if (!search) search = '';
    if (!perPage) perPage = '';

    return this._http.get<any>(`${this.API_URL}/promotion-admin?page=${page}&search=${search}&perPage=${perPage}`, this.requestOptions).pipe(
      map(res => JSON.parse(res)),
      retry(3),
      catchError(this.handleError)
    );
  }
  getPromotion(PromotionId:string):Observable<any>
  {
    const headers=new HttpHeaders().set("Content-Type","text/plain;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType:"text"
    }
    return this._http.get<any>("http://localhost:6868/promotion/"+PromotionId,requestOptions).pipe(
      map(res=>JSON.parse(res) as Array<Promotion>),
      retry(3),
      catchError(this.handleError))
  }
  postPromotion(aPromotion:any):Observable<any>
  {
    const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType:"text"
  }
    return this._http.post<any>("http://localhost:6868/promotion",JSON.stringify(aPromotion),requestOptions).pipe(
      map(res=>JSON.parse(res) as Array<IVoucher>),
      retry(3),
      catchError(this.handleError))
  }

  putPromotion(aPromotion:any):Observable<any>
  {
    const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType:"text"
  }
    return this._http.put<any>("http://localhost:6868/promotion",JSON.stringify(aPromotion),requestOptions).pipe(
      map(res=>JSON.parse(res) as Array<Promotion>),
      retry(3),
      catchError(this.handleError))
  }
  deletePromotion(_id:string):Observable<any>
  {
    const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
      headers:headers,
      responseType:"text"
    }
    return this._http.delete<any>("http://localhost:6868/promotion/"+_id,requestOptions).pipe(
    map(res=>JSON.parse(res)),
    retry(3),
    catchError(this.handleError))

  }
  filterPromotion(name: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain;charset=utf-8');
    const requestOptions: object = {
      headers: headers,
      responseType: 'text'
    };
    return this._http.get<any>(`${this.baseUrl}/search/${name}`, requestOptions).pipe(
      map(res => JSON.parse(res) as Array<IPromotion>),
      retry(3),
      catchError(this.handleError)
    );
  }
  handleError(error:HttpErrorResponse){
    return throwError(()=>new Error(error.message))
  }
}


