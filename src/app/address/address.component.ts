import { AddressService } from './../service/address.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Component, OnInit } from '@angular/core';
import { CustomHttpRespone } from '../model/custom-http-response';
import { Subscription } from 'rxjs';
import { User } from '../model/user';
import { Address } from '../model/address';
import { NotificationType } from '../enum/notification-type.enum';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  public user: User;
  addresses: Address[];

  constructor(private notificationService: NotificationService, private authenticationService: AuthenticationService, private addressService: AddressService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.getUserAddress();
  }

  getUserAddress(){
    const userId = this.user.userId;
      this.subscriptions.push(
        this.addressService.getUserAddresses(userId).subscribe(
          (response: Address[]) => {
            this.notificationService.notify(NotificationType.SUCCESS, `found ${response.length} addresses for this user`);

          this.addresses = response;
            // this.ngOnInit();
          },
          (errorResponse: HttpErrorResponse) => {
            this.notificationService.notify(NotificationType.ERROR, errorResponse.error.message);
  
          }
        )
      );
  }

  public onClickAddAddress(): void {
    this.clickButton('openAddress');
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }




}
