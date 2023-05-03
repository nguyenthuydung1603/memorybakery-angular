import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { PromotionManagementComponent } from './promotion-management/promotion-management.component';
import { BlogManagementComponent } from './blog-management/blog-management.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { PromotionDetailComponent } from './promotion-detail/promotion-detail.component';

const routes: Routes = [
  {path:"dashboard",component:DashboardComponent},
  {path: 'product-management', component:ProductManagementComponent },
  {path: 'promotion', component:PromotionManagementComponent },
  {path: 'blog', component:BlogManagementComponent},
  {path: 'customer', component:CustomerManagementComponent},
  {path:"promotion_detail/:id",component: PromotionDetailComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
