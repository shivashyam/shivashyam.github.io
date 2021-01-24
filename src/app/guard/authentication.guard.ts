import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../enum/notification-type.enum';
import { User } from '../model/user';
import { Role } from '../enum/role.enum';

@Injectable({providedIn: 'root'})
export class AuthenticationGuard implements CanActivate {
  user: User;


  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private notificationService: NotificationService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isUserLoggedIn();
  }

  private isUserLoggedIn(): boolean {
    if (this.authenticationService.isUserLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    this.notificationService.notify(NotificationType.ERROR, `You need to log in to access this page`);
    return false;
  }


//   private hasAdminAccess(): boolean {
//     if (this.isAdmin) {
//       return true;
//     }
//     this.router.navigate(['/products']);
//     this.notificationService.notify(NotificationType.ERROR, `You need to be an Admin access this page`);
//     return false;
//   }

//   private hasManagerAccess(): boolean {
//     if (this.isManager) {
//       return true;
//     }
//     this.router.navigate(['/products']);
//     this.notificationService.notify(NotificationType.ERROR, `You need to be a Manager access this page`);
//     return false;
//   }

//   private hasAdminOrManagerAccess(): boolean {
//     if (this.isAdminOrManager) {
//       return true;
//     }
//     this.router.navigate(['/products']);
//     this.notificationService.notify(NotificationType.ERROR, `You need to be a Manager access this page`);
//     return false;
//   }


  
//   public get isAdmin(): boolean {
//     return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
//   }

//   public get isManager(): boolean {
//     return this.isAdmin || this.getUserRole() === Role.MANAGER;
//   }

//   public get isAdminOrManager(): boolean {
//     return this.isAdmin || this.isManager;
//   }
//   private getUserRole(): string {
//     return this.authenticationService.getUserFromLocalCache().role;

// }
}
