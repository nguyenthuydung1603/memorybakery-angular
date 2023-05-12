import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { PromotionManagementComponent } from './promotion-management/promotion-management.component';
import { BlogManagementComponent } from './blog-management/blog-management.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { QuanLyDonHangComponent } from './quan-ly-don-hang/quan-ly-don-hang.component';
import { SettingComponent } from './setting/setting.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {path:"dashboard",component:DashboardComponent},
  {path: 'product-management', component:ProductManagementComponent },
  {path: 'promotion', component:PromotionManagementComponent },
  {path: 'bloggg', component:BlogManagementComponent},
  {path: 'customer', component:CustomerManagementComponent},
  {path: 'quanlydonhang', component:QuanLyDonHangComponent},
  { path: 'setting', component: SettingComponent },
  { path: '', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
