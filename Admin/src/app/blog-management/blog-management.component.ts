import { Component, HostListener, Input } from '@angular/core';
import { faPlus, faFilter, faSearchPlus, faEdit, faDeleteLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { AngularEditorConfig } from '@kolkov/angular-editor/public-api';
import { Blog } from '../models/Blog';
import { BlogService } from '../services/blog.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-management',
  templateUrl: './blog-management.component.html',
  styleUrls: ['./blog-management.component.css']
})
export class BlogManagementComponent {
  public Editor = ClassicEditor;
  blogs:any;
  searchTerm: string = '';
  errMessage:string=''
  totalPage: any = [];
  totalItem: any;
  page: number = 1;
  perPage: number = 10;
  search: string = '';
  isLoading = false;
  selectedBlog:any;
  showDetail = false;
  Blog=new Blog()
  constructor(private _service: BlogService, private http: HttpClient,private router:Router,private activateRoute:ActivatedRoute){
    this.getBlogs();
    activateRoute.paramMap.subscribe((param) => {
      let id = param.get("id");
      if (id != null) {
        this._service.getABlog(id).subscribe({
          next: (data) => {
            this.selectedBlog = data;
            // Assign selected product values to book
            this.Blog = this.selectedBlog;
          },
          error: (err) => {
            this.errMessage = err;
            console.log(this.errMessage);
          }
        })
      }
    })
  }
  getBlogs(){
    this._service.getPromotions(this.page, this.search, this.perPage).subscribe({
      next: (data) => {
        if (data.data.length == 0) {
          this.page = 1
          this.getBlogs()
        }
        this.blogs = data.data
        this.totalItem = data.totalItem
        this.isLoading = false

        let pageTmp = Math.ceil(this.totalItem / this.perPage)
        this.totalPage = Array(pageTmp)
      },
      error: (err) => {
        this.errMessage = err
        this.isLoading = false
      }
    })
    this.isLoading = false
  }
  showBlogDetail(blog: any) {
    this.selectedBlog = blog;
    this.showDetail = true;
  }
  closeBlogDetail() {
    this.showDetail = false;
  }
  // Đóng Modal khi click ra ngoài phạm vi của Modal
@HostListener('document:click', ['$event'])
public onClick(event: any): void {
  if (event.target.classList.contains('modal')) {
    this.closeBlogDetail();
    this.closeBlogNew();
  }
}
showAddBlog:boolean=false;
showBlogNew() {
  this.showAddBlog = true;
}
closeBlogNew() {
  this.showAddBlog = false
}
  public submitForm() {
    this.page = 1
    this.getBlogs();
    this.search = '';
  }
  paginateIcon(type: any) {
    switch (type) {
      case 'pre': {
        this.page -= 1
        if (this.page < 1) this.page = 1
        this.getBlogs()
        break
      }
      case 'next': {
        this.page += 1
        if (this.page > this.totalPage.length) this.page = 1
        this.getBlogs()
        break
      }
    }
  }

  paginate(page: any) {
    this.page = page
    this.getBlogs()
  }


  faPlus = faPlus
faFilter = faFilter
faSearchPlus = faSearchPlus
faEdit = faInfoCircle
faDelete = faDeleteLeft
isShow = false
isCreate = false
isUpdate = false
isVarian = false
@Input()
  requiredFileType:any;
  fileName = '';
  uploadProgress:number=0;
  uploadSub: Subscription=new Subscription();
  onFileSelected(event:any) {
    let me = this;
    let file = event.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.selectedBlog.Image = reader.result!.toString();
      };
      reader.onerror = (error) => {
        console.log('Error: ', error);
      };
    }
    this.selectedBlog.Image=this.fileName
    this.Blog.Image=this.fileName
  }
  cancelUpload() {
    this.uploadSub.unsubscribe();
  this.reset();
  }
  reset() {
  this.uploadProgress = 0;
  this.uploadSub = new Subscription();
  }
  putBlog() {
    this.selectedBlog.CreatedDate=new Date(Date.now())
    this._service.putABlog(this.selectedBlog).subscribe({
      next: (data) => {
        this.getBlogs();
        this.closeBlogDetail()
      },
      error: (err) => {
        this.errMessage = err;
      }
    });
  }
// getOutstandingList() {
//   this.service.getBlogsOutstanding().subscribe({
//     next: (data) => {
//       this.outstandingList = data
//     },
//     error: (err) => { this.errMess = err }
//   })
// }

// getABlog(_id: any) {
//   this.service.getABlog(_id).subscribe({
//     next: (data) => {
//       this.blogsList = data
//     },
//     error: (err) => { this.errMess = err }
//   })
// }

// postABlog() {
//   this.service.postABlog(this.blog).subscribe({
//     next: (data) => {
//       this.blogsList = data
//     },
//     error: (err) => { this.errMess = err }
//   })
// }
// putABlog() {
//   this.service.putABlog(this.blog).subscribe({
//     next: (data) => {
//       this.blogsList = data
//     },
//     error: (err) => { this.errMess = err }
//   })
// }
// deleteBlog(_id: any) {
//   if (confirm("Bạn có chắc chắn xóa?")==true){
//   this.service.deleteBlog(_id).subscribe({
//     next: (data) => {
//       this.blogsList = data
//     },
//     error: (err) => { this.errMess = err }

//   })
//   window.location.reload()
// }
// }

convertDate(date: any) {
  let fDate = new Date(date)
  return fDate.toLocaleString()
}




}

