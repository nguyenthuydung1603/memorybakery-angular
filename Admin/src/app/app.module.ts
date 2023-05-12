import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { QuanLyDonHangComponent } from './quan-ly-don-hang/quan-ly-don-hang.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { ProductManagementComponent } from './product-management/product-management.component';
import { PromotionManagementComponent } from './promotion-management/promotion-management.component';
import { BlogManagementComponent } from './blog-management/blog-management.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SettingComponent } from './setting/setting.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    QuanLyDonHangComponent,
    CustomerManagementComponent,
    ProductManagementComponent,
    PromotionManagementComponent,
    BlogManagementComponent,
    SettingComponent,
    LoginComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgxPaginationModule,
    FormsModule,
    HttpClientModule,
    AngularEditorModule,
    SweetAlert2Module.forRoot(),
    CKEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
