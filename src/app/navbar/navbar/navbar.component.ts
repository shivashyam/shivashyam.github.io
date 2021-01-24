import { Router } from '@angular/router';
import { AuthenticationService } from './../../service/authentication.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { Role } from 'src/app/enum/role.enum';
import { Subscription } from 'rxjs';
import { ShoppingCart } from 'src/app/model/shopping-cart';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  public user: User;
  public titleAction = 'Welcome to the Shop';
  constructor(private authenticationService: AuthenticationService, private router: Router, private cartService : CartService) { }

  ngOnInit(): void {
    this.user =  JSON.parse(localStorage.getItem('user'));
    this.changeTitle('Welcome to the Shop');
  }

  public changeTitle(title: string): void {
    if (this.router.url.includes('products')) {
      this.titleAction = 'welcome to the Shop';
    } else if (this.router.url.includes('user')) {
      this.titleAction = 'User Management';
    }  else if (this.router.url.includes('settings')) {
      this.titleAction = 'Settings';
    }  else if (this.router.url.includes('dashboard')) {
      this.titleAction = 'Dashboard';
    }  else if (this.router.url.includes('order')) {
      this.titleAction = 'Manage Orders';
    }
  }

  public getUserCart(): void {
    // const userId = this.user.userId;
    // this.subscriptions.push(
    //   this.cartService.getUserCart(userId).subscribe(
    //     (response: ShoppingCart[]) => {
    //       console.log(response);
    //     },
    //     (errorResponse: HttpErrorResponse) => {
    //       console.log(errorResponse);
    //     }
    //   )
    // );
    this.router.navigateByUrl('/cart')

  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  public get isManager(): boolean {
    return this.isAdmin || this.getUserRole() === Role.MANAGER;
  }

  public get isAdminOrManager(): boolean {
    return this.isAdmin || this.isManager;
  }
  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
