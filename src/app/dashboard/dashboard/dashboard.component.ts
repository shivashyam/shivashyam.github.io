import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/model/product';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ProductService } from 'src/app/service/product.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: User;
  users: User[];
  products: Product[];
  private subscriptions: Subscription[] = [];

  constructor(private authenticationService: AuthenticationService, 
    private userService: UserService, private productService: ProductService) { }

  ngOnInit(): void {
    this.users = this.userService.getUsersFromLocalCache();
    this.user = this.authenticationService.getUserFromLocalCache();
    // this.getProducts();
  }

  // public getProducts(): void {
  //   // this.showLoading = true;
  //   this.subscriptions.push(
  //     this.productService.getProducts().subscribe(
  //       (response: Product[]) => {
  //         this.products = response;
  //       },
  //       (errorResponse: HttpErrorResponse) => {
  //         console.log('error')
  //       }
  //     )
  //   );
  //     }

  // public searchUsers(searchTerm: string): void {
  //   const results: User[] = [];
  //   for (const user of this.userService.getUsersFromLocalCache()) {
  //     if (user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
  //         user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
  //         user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
  //         user.userId.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
  //         results.push(user);
  //     }
  //   }
  //   this.users = results;
  //   if (results.length === 0 || !searchTerm) {
  //     this.users = this.userService.getUsersFromLocalCache();
  //   }
  // }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
