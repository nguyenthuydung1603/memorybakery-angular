import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { PromotionManagementComponent } from './promotion-management/promotion-management.component';
import { BlogManagementComponent } from './blog-management/blog-management.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { PromotionDetailComponent } from './promotion-detail/promotion-detail.component';
import { QuanLyDonHangComponent } from './quan-ly-don-hang/quan-ly-don-hang.component';
import { ChiTietDonHangComponent } from './chi-tiet-don-hang/chi-tiet-don-hang.component';
import { SettingComponent } from './setting/setting.component';

const routes: Routes = [
  {path:"dashboard",component:DashboardComponent},
  {path: 'product-management', component:ProductManagementComponent },
  {path: 'promotion', component:PromotionManagementComponent },
  {path: 'bloggg', component:BlogManagementComponent},
  {path: 'customer', component:CustomerManagementComponent},
  {path:"promotion_detail/:id",component: PromotionDetailComponent},
  {path: 'quanlydonhang', component:QuanLyDonHangComponent},
  {path: 'quanlydonhangchitiet/:id', component:ChiTietDonHangComponent},
  { path: 'setting', component: SettingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
