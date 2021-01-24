import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NotificationType } from '../enum/notification-type.enum';
import { Role } from '../enum/role.enum';


@Injectable({providedIn: 'root'})
export class AuthenticationService {
  public host = environment.apiUrl;
  private token: string;
  private loggedInUsername: string;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, 
              private notificationService: NotificationService,
              private router: Router) {}

  public login(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${this.host}/user/login`, user, { observe: 'response' });
  }

  public register(user: User): Observable<User> {
    return this.http.post<User>(`${this.host}/user/register`, user);
  }

  public logOut(): void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public addUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalCache(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  public loadToken(): void {
    this.token = localStorage.getItem('token');
  }

  public getToken(): string {
    return this.token;
  }

  public isUserLoggedIn(): boolean {
    this.loadToken();
    if (this.token != null && this.token !== ''){
      if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
        if (!this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          return true;
        }
      }
    } else {
      this.logOut();
      return false;
    }
  }


  
  public hasAdminAccess(): boolean {
    if (this.isAdmin) {
      return true;
    }
    this.router.navigate(['/products']);
    this.notificationService.notify(NotificationType.ERROR, `You need to be an Admin access this page`);
    return false;
  }

  public hasManagerAccess(): boolean {
    if (this.isManager) {
      return true;
    }
    this.router.navigate(['/products']);
    this.notificationService.notify(NotificationType.ERROR, `You need to be a Manager access this page`);
    return false;
  }

  public hasAdminOrManagerAccess(): boolean {
    if (this.isAdminOrManager) {
      return true;
    }
    this.router.navigate(['/products']);
    this.notificationService.notify(NotificationType.ERROR, `You need to be an Admin or Manager access this page`);
    return false;
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
  public getUserRole(): string {
    return this.getUserFromLocalCache().role;

}


  }


