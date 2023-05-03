import { Component, HostListener } from '@angular/core';
import { faPlus, faFilter, faSearchPlus, faEdit, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { ProductAdminService } from '../product-admin.service';

import { DomSanitizer } from '@angular/platform-browser';
import { Product, Variant } from '../models/Product';
import { functionCustom } from '../custom-function/functionCustom';
import swal from '../custom-function/swal2';
@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent {
  // pagination & sort & search
  totalPage: any = []
  totalItem: any
  page: number = 1
  perPage: number = 10
  search: string = ''
  sortBy: string = ''
  orderBy: string = ''

  // orther
  faPlus = faPlus
  faFilter = faFilter
  faSearchPlus = faSearchPlus
  faEdit = faEdit
  faDelete = faDeleteLeft
  isShow = false
  isShowModelSort = false
  isCreate = false
  isUpdate = false
  isVarian = false
  isLoading = false

  // binding sort
  isSelectedSort: string = ''

  // binding choose size
  isChangeValue: boolean = false
  selectVariant: any = null

  // edit a product
  selectedProduct: any

  // binding size in new product or update product
  haveSize: any = 'n'

  listProducts: any
  errMess: string = ''
  listCreateImageTmp: any = []
  product = new Product()
  variant = new Variant()
  orVariant = new Variant()
  listSort: Array<string> = [
    'Tên (A -> Z)', 'Tên (Z -> A)', 'Danh mục (A -> Z)', 'Danh mục (Z -> A)'
  ]
  listCategories: Array<string> = [
    'Bánh kem', 'Cupcakes', 'Bánh quy', 'Donuts', 'Bánh mì'
  ]

  //hàm khởi tạo
  constructor(private service: ProductAdminService, public sanitizer: DomSanitizer) {
    this.getList()
  }

  getList() {
    this.isLoading = true
    this.service.getProductList(this.page, this.sortBy, this.orderBy, this.search, this.perPage).subscribe({
      next: (data) => {
        if (data.data.length == 0) {
          this.page = 1
          this.getList()
        }
        this.listProducts = data.data
        this.totalItem = data.totalItem
        this.isLoading = false

        let pageTmp = Math.ceil(this.totalItem / this.perPage)
        this.totalPage = Array(pageTmp)

        this.isChangeValue = false
        this.selectVariant = null
      },
      error: (err) => {
        this.errMess = err
        this.isLoading = false
      }
    })
    this.isLoading = false
  }
  public submitForm() {
    this.getList()
    this.search = ''
  }

  public isShowVarian(size: any) {
    this.orVariant = this.product.Variant.find((v: any) => v.Size == size)
    this.isVarian = true
  }

  public actionAdd() {
    this.isShow = true
    this.isCreate = true
  }

  public actionUpdate(id: any) {
    this.isShow = true
    this.isUpdate = true

    this.service.getAProduct(id).subscribe({
      next: (data) => {
        this.product._id = data._id
        this.product.Name = data.Name
        this.product.Category = data.Category
        this.product.Description = data.Description
        this.product.Variant = data.Variant
        this.product.Img = functionCustom.cloneArray(data.Img)
        this.listCreateImageTmp = functionCustom.cloneArray(data.Img)
        data.Variant[0].Size != 'None' ? this.haveSize = 'y' : this.haveSize = 'n'
        this.variant.Size = data.Variant[0].Size
        this.variant.UnitPrice = data.Variant[0].UnitPrice
        this.variant.PromotionPrice = data.Variant[0].PromotionPrice

      },
      error: (err) => {
        this.errMess = err
      }
    })
  }

  public actionCancel() {
    this.isCreate = false
    this.isShow = false
    this.isShowModelSort
    this.isVarian = false
    this.isUpdate = false
    this.haveSize = 'n'
    this.listCreateImageTmp = []
    this.product = new Product()
    this.variant = new Variant()
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent) {
    const { target } = event
    if (target) {
      if ((target as HTMLButtonElement).id == 'fog') this.actionCancel()
    }
  }

  selectOption(item: string) {
    this.isSelectedSort = item
    this.isShowModelSort = false
    switch (item) {
      case 'Tên (A -> Z)': {
        this.sortBy = 'name'
        this.orderBy = 'asc'
        break
      }
      case 'Tên (Z -> A)': {
        this.sortBy = 'name'
        this.orderBy = 'desc'
        break
      }
      case 'Danh mục (A -> Z)': {
        this.sortBy = 'category'
        this.orderBy = 'asc'
        break
      }
      case 'Danh mục (Z -> A)': {
        this.sortBy = 'category'
        this.orderBy = 'desc'
        break
      }
    }
    this.getList()
  }

  isChoose(event: any, product: any) {
    this.isChangeValue = true
    let curVa = product.Variant.find((v: any) => v.Size == event.target.value)

    curVa.parent_id = product._id
    this.selectVariant = curVa
  }


  convertVND(price: any) {
    return price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  }

  storeProduct() { //tao moi 1 product

    if (this.product.Name == ''
      || this.product.Category == ''
      || this.product.Description == '') return swal.error('Phải nhập tất cả các thông tin để tạo mới sản phẩm!', 3000)
    if (this.listCreateImageTmp.length == 0) return swal.error('Phải có ít nhất 1 ảnh!', 3000)
    // nếu haveSize có giá trị và haveSize = 'n'
    if (this.haveSize && this.haveSize == 'n') this.variant.Size = 'None'
    this.product.Variant.push(this.variant)
    // [].push(a) => ['a']
    this.service.postAProduct(this.product).subscribe({
      next: (data) => {
        this.getList()
        swal.success(data.message ?? 'Đã tạo mới sản phẩm thành công', 3000)
      },
      error: (err) => {
        swal.error(err)
      }
    })

    this.resetForm()
    this.actionCancel()
  }

  updateProduct(product: any) {
    if (this.product.Name == ''
    || this.product.Category == ''
    || this.product.Description == '') return swal.error('Phải nhập tất cả các thông tin để chỉnh sửa sản phẩm!', 3000)
    if (this.listCreateImageTmp.length == 0) return swal.success('Phải có ít nhất 1 ảnh!', 3000)
    this.service.putAProduct(product).subscribe({
      next: (data) => {
        this.actionCancel()
        this.getList()
        swal.success(data.message ?? 'Đã chỉnh sửa sản phẩm thành công')
      },
      error: (err) => {
        swal.error(err, 3000)
      }
    })
  }

  resetForm() {
    this.product = new Product()
    this.variant = new Variant()
  }

  deleteProduct(id: any) {
    this.service.deleteProduct(id).subscribe({
      next: (data) => {
        this.getList()
        swal.success(data.message ?? 'Đã xoá thành công', 3000)
      },
      error: (err) => {
        swal.error(err)
      }
    })
  }

  public handleDismiss(dismissMethod: any): void {
  }

  paginateIcon(type: any) {
    switch (type) {
      case 'pre': {
        this.page -= 1
        if (this.page < 1) this.page = 1
        this.getList()
        break
      }
      case 'next': {
        this.page += 1
        if (this.page > this.totalPage.length) this.page = 1
        this.getList()
        break
      }
    }
  }

  paginate(page: any) {
    this.page = page
    this.getList()
  }

  convertDate(date: any) {
    return functionCustom.convertDate(date)
  }

  checkToShowVariantButton() {
    if (this.haveSize == 'n') this.isVarian = false
  }

  convertBase64ToImage(b64: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(b64)
  }

  storeVariant() {
    this.product.Variant.push(this.orVariant)
    this.isVarian = false
    this.orVariant = new Variant()
    swal.success('Tạo mới biến thể thành công', 2000)
  }

  updateVariant(product: any, orVariant: any) {
    product.Variant.map((v: any) => {
      if (v.Size == orVariant.Size) {
        return v = orVariant
      }
    })
    this.service.putAProduct(product).subscribe({
      next: (data) => {
        this.isVarian = false
        this.getList()
        swal.success('Đã chỉnh sửa biến thể thành công')
      },
      error: (err) => {
        swal.error(err, 3000)
      }
    })
  }

  deleteVariant(product: any, orVariant: any) {
    functionCustom.removeElementByValue(product.Variant, orVariant)
    this.service.putAProduct(product).subscribe({
      next: (data) => {
        this.getList()
        swal.success('Đã xoá biến thể thành công')
      },
      error: (err) => {
        swal.error(err, 3000)
      }
    })
  }

  onFileChange(event: any) {

    if (event.target.files) {
      let reader = new FileReader()
      // nó là 1 đối tượng để xử lý các file
      // 1 đối tượng gọi đến 1 hàm
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (e: any) => {
        this.listCreateImageTmp.push(e.target.result)
        this.product.Img.push(reader.result?.toString()) // chuyển từ ảnh thành đống chữ thấy gớm á
      }
    }
  }

  onRemove(image: any) {
    // if(this.listCreateImageTmp.length == 1) return swal.error('Phải có ít nhất 1 ảnh, hãy thêm ảnh mới trước khi xoá!', 3000)
    functionCustom.removeElementByValue(this.listCreateImageTmp, image)
    functionCustom.removeElementByValue(this.product.Img, image)
  }
}
