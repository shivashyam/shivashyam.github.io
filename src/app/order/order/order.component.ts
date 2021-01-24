import { Order } from './../../model/order';
import { OrderService } from './../../service/order.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  public refreshing: boolean;
  private subscriptions: Subscription[] = [];
  public orders: Order[];
  public order: Order;

  constructor(private authenticationService: AuthenticationService, private router: Router, private orderService: OrderService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/orders');
      this.getOrders(true);
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  public getOrders(showNotification: boolean): void {
    this.refreshing = true;
    // this.showLoading = true;
    this.subscriptions.push(
      this.orderService.getOrders().subscribe(
        (response: Order[]) => {
          this.orders = response;
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} Orders(s) loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );

  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  public searchOrders(searchTerm: string): void {
    const results: Order[] = [];
    for (const order of this.orders) {
      if (order.orderNumber.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          order.orderStatus.toString().toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          order.deliveryType.toString().toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          order.originalOrderAmount.toString().toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
          results.push(order);
      }
    }
    this.orders = results;
    if (results.length === 0 || !searchTerm) {
      this.orders = this.orders;
    }
  }


}
