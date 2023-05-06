import { Component } from '@angular/core';
import { faPlus, faFilter, faSearchPlus, faEdit, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { AngularEditorConfig } from '@kolkov/angular-editor/public-api';
import { Blog } from '../models/Blog';
import { BlogService } from '../services/blog.service';

@Component({
  selector: 'app-blog-management',
  templateUrl: './blog-management.component.html',
  styleUrls: ['./blog-management.component.css']
})
export class BlogManagementComponent {
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
    {
      name: 'quote',
      class: 'quote',
    },
    {
      name: 'redText',
      class: 'redText'
    },
    {
      name: 'titleText',
      class: 'titleText',
      tag: 'h1',
    },
  ],
  };
faPlus = faPlus
faFilter = faFilter
faSearchPlus = faSearchPlus
faEdit = faEdit
faDelete = faDeleteLeft
isShow = false
isCreate = false
isUpdate = false
isVarian = false
isLoading = false


public submitForm() {
this.isLoading = true
setTimeout(() => {
  this.isLoading = false
}, 2000)

}

public submitVarian() { }

public isShowVarian(id: any) {
this.isVarian = true
}

public actionAdd() {
this.isCreate = true
}

public actionUpdate(id: any) {
this.isShow = true
this.isUpdate = true
}

public actionCancel() {
this.isCreate = false
this.isShow = false
this.isVarian = false
this.isUpdate = false
}

//paginate
page = 1
perPage: number = 5
totalItem: any = 0
totalPage: any = []

// orther
blog=new Blog();
blogs:any
blogsList: any
outstandingList: any
errMess: string = ''
constructor(private service: BlogService) {
  this.service.getBlogs().subscribe({
    next:(data)=>{this.blogs=data},
    error:(err)=>{this.errMess=err}
  })
}

getBlogsList(page: any = 1) {
  this.page = page
  this.service.getBlogsList(this.page).subscribe({
    next: (data) => {
      this.blogsList = data.data
      this.totalItem = data.totalItem

      let pageTmp = Math.ceil(this.totalItem / this.perPage)
      this.totalPage = Array(pageTmp)
    },
    error: (err) => { this.errMess = err }
  })
}

getOutstandingList() {
  this.service.getBlogsOutstanding().subscribe({
    next: (data) => {
      this.outstandingList = data
    },
    error: (err) => { this.errMess = err }
  })
}

getABlog(_id: any) {
  this.service.getABlog(_id).subscribe({
    next: (data) => {
      this.blogsList = data
    },
    error: (err) => { this.errMess = err }
  })
}

postABlog() {
  this.service.postABlog(this.blog).subscribe({
    next: (data) => {
      this.blogsList = data
    },
    error: (err) => { this.errMess = err }
  })
}
putABlog() {
  this.service.putABlog(this.blog).subscribe({
    next: (data) => {
      this.blogsList = data
    },
    error: (err) => { this.errMess = err }
  })
}
deleteBlog(_id: any) {
  if (confirm("Bạn có chắc chắn xóa?")==true){
  this.service.deleteBlog(_id).subscribe({
    next: (data) => {
      this.blogsList = data
    },
    error: (err) => { this.errMess = err }

  })
  window.location.reload()
}
}

convertDate(date: any) {
  let fDate = new Date(date)
  return fDate.toLocaleString()
}




}

