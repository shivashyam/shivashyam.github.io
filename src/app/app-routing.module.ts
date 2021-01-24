import { AddressComponent } from './address/address.component';
import { AdminOrManagerGuard } from './guard/admin-or-manager.guard';
import { CartComponent } from './cart/cart/cart.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { SettingsComponent } from './settings/settings/settings.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { ProductComponent } from './product/product/product.component';
import { OrderComponent } from './order/order/order.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { AdminGuard } from './guard/admin.guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'products', component: ProductComponent},
  { path: 'orders', component: OrderComponent, canActivate: [AuthenticationGuard, AdminOrManagerGuard] },
  { path: 'address', component: AddressComponent, canActivate: [AuthenticationGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthenticationGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthenticationGuard, AdminGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticationGuard, AdminOrManagerGuard] },
  { path: 'user/management', component: UserComponent, canActivate: [AuthenticationGuard, AdminOrManagerGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
