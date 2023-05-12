import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { IProduct } from 'src/app/models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductAdminService {
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

  getProductList(page: any, sortBy: any, orderBy: any, search: any, perPage:any): Observable<any> {
    if (!page) page = 1
    if (!sortBy) sortBy = ''
    if (!orderBy) orderBy = ''
    if (!search) search = ''
    if (!perPage) perPage = ''
    return this._http.get<any>(`${this.API_URL}/products-admin?page=${page}&sortBy=${sortBy}&orderBy=${orderBy}&search=${search}&perPage=${perPage}`, this.requestOptions).pipe(
      map(res => JSON.parse(res) as Array<IProduct>),
      retry(3),
      catchError(this.handleError)
    )
  }

  getAProduct(pId: any): Observable<any> {
    return this._http.get<any>(`${this.API_URL}/product-admin/` + pId, this.requestOptions).pipe(
      map(res => JSON.parse(res) as IProduct),
      retry(3),
      catchError(this.handleError)
    )
  }
  postAProduct(product: any): Observable<any> {
    const fd = new FormData()
    // fd.append('Name', product.Name)
    // fd.append('Category', product.Category)
    // fd.append('Variant', product.Variant)
    // fd.append('Img', product.Img)
    // fd.append('Description', product.Description)
    // fd.append('Img', product.Img[0])
    return this._http.post<any>(`${this.API_URL}/products-admin`, product).pipe(
      map(res => res),
      retry(3),
      catchError(this.handleError)
    )
  }

  putAProduct(product: any): Observable<any> {
    // const fd = new FormData()
    // fd.append('Title', blog.Title)
    // fd.append('Writer', blog.Writer)
    // fd.append('Content', blog.Content)
    // fd.append('Image', blog.Image)
    // fd.append('Outstanding', blog.Outstanding)
    return this._http.put<any>(`${this.API_URL}/products-admin/${product._id}`, product).pipe(
      map(res => res),
      retry(3),
      catchError(this.handleError)
    )
  }

  deleteProduct(proId: any): Observable<any> {
    return this._http.delete<any>(`${this.API_URL}/products-admin/` + proId, this.requestOptions2).pipe(
      map(res => res),
      retry(3),
      catchError(this.handleError)
    )
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message))
  }
}
