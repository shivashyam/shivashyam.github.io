import { DiscountService } from './../../service/discount.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from './../../service/notification.service';
import { NotifierService } from 'angular-notifier';
import { UserService } from 'src/app/service/user.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CustomHttpRespone } from 'src/app/model/custom-http-response';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { Role } from 'src/app/enum/role.enum';
import { Discount } from 'src/app/model/discount';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  refreshing: boolean;
  subscriptions: Subscription[] = [];
  discountCoupons: Discount[];
  editCoupon: Discount;
  editSelected: boolean = false;
  p: any;

  constructor(private userService: UserService, 
              private notificationService: NotificationService, 
              private authenticationService: AuthenticationService,
              private discountService: DiscountService) { }

  ngOnInit(): void {
    this.getCouponData();
  }

  public onResetPassword(emailForm: NgForm): void {
    this.refreshing = true;
    const emailAddress = emailForm.value['reset-password-email'];
    this.subscriptions.push(
      this.userService.resetPassword(emailAddress).subscribe(
        (response: CustomHttpRespone) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.refreshing = false;
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.WARNING, error.error.message);
          this.refreshing = false;
        },
        () => emailForm.reset()
      )
    );
  }

  public getCouponData(){
    this.subscriptions.push(
      this.discountService.getCoupons().subscribe(
        (response: Discount[]) => {
          this.discountCoupons = response;
          this.sendNotification(NotificationType.SUCCESS, `retrieved ${response.length} Coupons`);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.WARNING, error.error.message);
          this.refreshing = false;
        },
      )
    );
  }

  onClickEditCoupon(coupon: Discount){
    this.editSelected = true;
    this.editCoupon = coupon;
    this.clickButton('openCouponModal');
  }

  onClickAddCoupon(){
    this.editSelected = true;
    this.editCoupon = new Discount();
    this.clickButton('openCouponAddModal');
  }

  onDeleteCoupon(couponId: number){
    this.discountService.deleteCoupon(couponId).subscribe(
      (response: CustomHttpRespone) => {
        this.sendNotification(NotificationType.SUCCESS, response.message);
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        this.sendNotification(NotificationType.WARNING, error.error.message);
        this.refreshing = false;
      },
    );
  }

  

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
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

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
