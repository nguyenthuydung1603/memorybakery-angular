import { Component } from '@angular/core';
import { faPlus, faFilter, faSearchPlus, faEdit, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { AngularEditorConfig } from '@kolkov/angular-editor/public-api';

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
this.isShow = true
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
blogs=[{
  "BlogId":"1",
  "BlogName": "Cách làm bánh Matcha Latte",
  "Title":"Cách làm bánh Matcha Latte",
  "Start": "20-4-2023",
  "Author": "Đinh Trần Xuân Nguyên",
  "View": 40
},
{   
  "BlogId":"2",
  "BlogName": "Sự hấp dẫn của Cupcakes",
  "Title":"Sự hấp dẫn của Cupcakes",
  "Start": "20-4-2023",
  "Author": "Trần Thị Thuận",
  "View": 40
}
]
}

