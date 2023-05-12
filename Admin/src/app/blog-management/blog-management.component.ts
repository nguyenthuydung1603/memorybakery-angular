import { Component, HostListener, Input } from '@angular/core';
import { faPlus, faFilter, faSearchPlus, faEdit, faDeleteLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { AngularEditorConfig } from '@kolkov/angular-editor/public-api';
import { Blog } from '../models/Blog';
import { BlogService } from '../services/blog.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Subscription } from 'rxjs';
import swal from '../custom-function/swal2';

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
  blog=new Blog()
  staffBlogs: any[]=[];
  constructor(private _service: BlogService, private http: HttpClient,private router:Router,private activateRoute:ActivatedRoute){
    this.getBlogs();
    this.getStaffBlogs();
  }
  getBlogs(){
    this._service.getBlogs(this.page, this.search, this.perPage).subscribe({
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
    this.showDetail = true;
    this.selectedBlog = blog;
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

  getStaffBlogs() {
  this._service.getStaffBlog().subscribe(
    (data) => {
      this.staffBlogs = data;
    },
    (error) => {
      console.error(error); // Handle error case
    }
  );
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
        this.newBlog.Image = reader.result!.toString();
      };
      reader.onerror = (error) => {
        console.log('Error: ', error);
      };
    }
    this.selectedBlog.Image=this.fileName
    this.blog.Image=this.fileName
    this.newBlog.Image=this.fileName
  }
  cancelUpload() {
    this.uploadSub.unsubscribe();
  this.reset();
  }
  reset() {
  this.uploadProgress = 0;
  this.uploadSub = new Subscription();
  }
  updateSelectedWriter(event: any) {
    this.selectedBlog.Writer = event.target.value;
  }
  addSelectedWriter(event: any) {
    this.newBlog.Writer = event.target.value;
  }

  putBlog() {
    this.selectedBlog.CreateDate = new Date()
    this._service.putABlog(this.selectedBlog).subscribe(
      (data) => {
        // Cập nhật blog đã cập nhật thành công vào danh sách blogs hiện tại
        const updatedIndex = this.blogs.findIndex((blog: any) => blog._id === this.selectedBlog._id);
        if (updatedIndex !== -1) {
          this.blogs[updatedIndex] = this.selectedBlog;
        }
        swal.success(data.message ?? 'Đã chỉnh sửa Blog thành công')
        this.closeBlogDetail(); // Đóng modal chi tiết blog
      },
      (error) => {
        this.errMessage = error;
      }
    );
  }
  newBlog = new Blog();
  postBlog()
{
  this.newBlog.CreateDate=new Date(Date.now())
  this._service.postBlog(this.newBlog).subscribe({
    next:(data)=>{
      this.getBlogs();
      this.showAddBlog = false;
      swal.success(data.message ?? 'Đã thêm mới 1 Blog thành công')
    },
    error:(err)=>{this.errMessage=err}
  })
  }

  deleteBlog(id: any) {
  this._service.deleteBlog(id).subscribe({
    next: (data) => {
      this.getBlogs()
      swal.success(data.message ?? 'Đã xoá thành công', 1500)
    },
    error: (err) => {
      swal.error(err)
    }
  })
  }

  public handleDismiss(dismissMethod: any): void {
  }

  convertDate(date: any) {
    let fDate = new Date(date)
    return fDate.toLocaleString()
  }
}

