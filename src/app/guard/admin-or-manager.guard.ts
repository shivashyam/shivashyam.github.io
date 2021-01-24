import { NotificationService } from 'src/app/service/notification.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminOrManagerGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService, private router: Router,
    private notificationService: NotificationService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.authenticationService.hasAdminOrManagerAccess();
  }

  
}
