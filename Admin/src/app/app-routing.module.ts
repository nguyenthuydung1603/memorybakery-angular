import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { PromotionManagementComponent } from './promotion-management/promotion-management.component';

const routes: Routes = [
  {path:"dashboard",component:DashboardComponent},
  {path: 'product-management', component:ProductManagementComponent },
  {path: 'promotion', component:PromotionManagementComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
