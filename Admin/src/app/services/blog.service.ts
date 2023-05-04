import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { IBlog } from '../models/Blog';


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
postABlog(blog: any): Observable<any> {
    const fd = new FormData()
    fd.append('Title', blog.Title)
    fd.append('Writer', blog.Writer)
    fd.append('Content', blog.Content)
    fd.append('Image', blog.Image)
    fd.append('Outstanding', blog.Outstanding)
    return this._http.post<any>(`${this.API_URL}/blogs`, fd).pipe(
      map(res => res as Array<IBlog>),
      retry(3),
      catchError(this.handleError)
    )
  }

  putABlog(blog: any): Observable<any> {
    const fd = new FormData()
    fd.append('Title', blog.Title)
    fd.append('Writer', blog.Writer)
    fd.append('Content', blog.Content)
    fd.append('Image', blog.Image)
    fd.append('Outstanding', blog.Outstanding)
    return this._http.put<any>(`${this.API_URL}/blogs`, fd).pipe(
      map(res => res as Array<IBlog>),
      retry(3),
      catchError(this.handleError)
    )
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
