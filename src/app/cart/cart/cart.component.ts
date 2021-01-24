import { NotificationService } from 'src/app/service/notification.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartService } from 'src/app/service/cart.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { HttpErrorResponse } from '@angular/common/http';
import { ShoppingCart } from 'src/app/model/shopping-cart';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { CouponResponse } from 'src/app/model/coupon';
import { CustomHttpRespone } from 'src/app/model/custom-http-response';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  public user: User;
  shoppingCartList: ShoppingCart[];
  couponCode: string = '';
  zip: string = '';
  totalOrderAmount: number;
  couponSuccess: boolean = false;


  couponUsed: string = '';
  depositAmount: number = 0.0;
  discountAmount: number = 0.0;
  originalOrderTotal: number = 0.0;
  totalAmountAfterDiscount: number = 0.0;

  constructor(private cartService: CartService, private authenticationService :AuthenticationService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.user =  JSON.parse(localStorage.getItem('user'));
    this.getUserCart();
  }


  public getUserCart(): void {
    const userId = this.user.userId;
    this.subscriptions.push(
      this.cartService.getUserCart(userId).subscribe(
        (response: ShoppingCart[]) => {
          this.shoppingCartList = response;
          this.getOrderTotal();
          console.log(response);
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
        }
      )
    );

  }

  public deleteCart(): void{
    const cartId = this.shoppingCartList[0].cartId
    this.subscriptions.push(
      this.cartService.deleteCart(cartId).subscribe(
        (response: any) => {
          console.log(response);
          this.ngOnInit();
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
        }
      )
    );
  }

  public deleteCartDetail(cartDetailId: number): void{
    this.subscriptions.push(
      this.cartService.deleteCartDetail(cartDetailId).subscribe(
        (response: any) => {
          console.log(response);
          this.ngOnInit();
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
        }
      )
    );
  }

  

  public updateCart(cartId: number, quantity: number): void{
    
    this.subscriptions.push(
      this.cartService.updateCart(cartId, quantity).subscribe(
        (response: any) => {
          console.log(response);
          this.ngOnInit();
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
        }
      )
    );
  }

  public applyCoupon(){
    this.couponCode;
    const orderAmount = this.getOrderTotal();
    this.subscriptions.push(
      this.cartService.applyCoupon(this.couponCode, orderAmount).subscribe(
        (response: CouponResponse) => {
          console.log(response);
          this.couponSuccess = true;
          this.couponUsed = response.couponUsed;
          this.depositAmount = response.depositAmount;
          this.discountAmount = response.discountAmount;
          this.originalOrderTotal = response.originalOrderTotal;
          this.totalAmountAfterDiscount = response.totalAmountAfterDiscount;
          
          if(response.discountAmount == 0){
            this.notificationService.notify(NotificationType.ERROR, `Coupon with "${this.couponCode}" Not Found, Please try a valid Coupon`);
            this.couponSuccess = false;
          }else{
            this.notificationService.notify(NotificationType.SUCCESS, `Applied Coupon: ${this.couponUsed}`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.notify(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
    
  }

  public calculateDelivery(){
    this.zip;
    this.subscriptions.push(
      this.cartService.calculateDelivery(this.zip).subscribe(
        (response: any) => {
          console.log(response);
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
        }
      )
    );
    
  }

  getOrderTotal(): number{
    let orderTotal: number = this.shoppingCartList.map(a => a.orderTotal).reduce((a, b) => a + b, 0);
    this.totalOrderAmount = orderTotal;
    return orderTotal;
  }

  updateProductQuantity(event, cartDetailsId) {
    this.subscriptions.push(
      this.cartService.updateCart(cartDetailsId, event.target.value).subscribe(
        (response: CustomHttpRespone) => {
          this.notificationService.notify(NotificationType.SUCCESS, response.message);
          this.ngOnInit();
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.notify(NotificationType.ERROR, errorResponse.error.message);

        }
      )
    );
  }
}
