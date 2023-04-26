import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { MainComponent } from './main/main.component';
import { ContactComponent } from './contact/contact.component';
import { BlogComponent } from './blog/blog.component';
import { ListProductComponent } from './list-product/list-product.component';
import { PromotionComponent } from './promotion/promotion.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentPolicyComponent } from './payment-policy/payment-policy.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guards/auth.guard';
const routes: Routes = [
  {path:"",component:MainComponent},
  {path:"aboutUs",component:AboutUsComponent},
  {path:"contact",component:ContactComponent},
  {path:"blog",component:BlogComponent},
  {path:"listProduct",component:ListProductComponent},
  {path:"promotion",component:PromotionComponent},
  {path:"cart",component:CartComponent},
  {path:"checkout",component:CheckoutComponent},
  {path:"paymentPolicy",component:PaymentPolicyComponent  },
  {path:"privacyPolicy",component:PrivacyPolicyComponent},
  {path:"myAccount",component:AccountComponent,canActivate : [AuthGuard]},
  {path:"login",component:LoginComponent},
  {path:"register",component:RegisterComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
