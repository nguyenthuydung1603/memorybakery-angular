import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { Blog, IBlog } from '../models/Blog';


@Injectable({
  providedIn: 'root'
})
export class BlogService {
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
  getBlogs(page: any, search: any, perPage: any): Observable<any> {
    if (!page) page = 1;
    if (!search) search = '';
    if (!perPage) perPage = '';

    return this._http.get<any>(`${this.API_URL}/blog-admin?page=${page}&search=${search}&perPage=${perPage}`, this.requestOptions).pipe(
      map(res => JSON.parse(res)),
      retry(3),
      catchError(this.handleError)
    );
  }


  getBlogsList(page: any): Observable<any> {
    if (!page) page = 1
    return this._http.get<any>(`${this.API_URL}/blogs-sorted?page=${page}`, this.requestOptions).pipe(
      map(res => JSON.parse(res) as Array<IBlog>),
      retry(3),
      catchError(this.handleError)
    )
  }
  getBlogsOutstanding(): Observable<any> {
    return this._http.get<any>(`${this.API_URL}/blogs-outstanding`, this.requestOptions).pipe(
      map(res => JSON.parse(res) as Array<IBlog>),
      retry(3),
      catchError(this.handleError)
    )
  }

  getABlog(_id: any): Observable<any> {
    return this._http.get<any>(`${this.API_URL}/blog/` + _id, this.requestOptions).pipe(
      map(res => JSON.parse(res) as IBlog),
      retry(3),
      catchError(this.handleError)
    )
  }

  getStaffBlog(): Observable<any> {
    return this._http.get<any>(`${this.API_URL}/blog-admin/blogStaff/`, this.requestOptions).pipe(
      map(res => JSON.parse(res)),
      retry(3),
      catchError(this.handleError)
    )
  }
postBlog(blog: any): Observable<any> {
  const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
  const requestOptions:Object={
    headers:headers,
    responseType:"text"
  }
  return this._http.post<any>(`${this.API_URL}/blogs`,JSON.stringify(blog),requestOptions).pipe(
    map(res=>JSON.parse(res) as Blog),
    retry(3),
    catchError(this.handleError))
  }

  putABlog(blog: any): Observable<any> {
    {
      const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
      const requestOptions:Object={
        headers:headers,
        responseType:"text"
      }
      return this._http.put<any>(`${this.API_URL}/blogs`,JSON.stringify(blog),requestOptions).pipe(
        map(res=>JSON.parse(res) as Blog),
        retry(3),
        catchError(this.handleError))
      }
  }

  deleteBlog(_id: any): Observable<any> {
    return this._http.delete<any>(`${this.API_URL}/blogs/` + _id, this.requestOptions).pipe(
      map(res => res as Array<IBlog>),
      retry(3),
      catchError(this.handleError)
    )
  }

  sortBlog(Title: string): Observable<any> {
    return this._http.get<any>(`${this.API_URL}/search/${Title}`, this.requestOptions).pipe(
      map(res => res as Array<IBlog>),
      retry(3),
      catchError(this.handleError)
    )
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message))
  }
}
