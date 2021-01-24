export class User {
  public id: number;
  public userId: string;
  public firstName: string;
  public lastName: string;
  public username: string;
  public password: string;
  public email: string;
  public phone: string;
  public street: string;
  public city: string;
  public zip: string;
  public province: string;
  public country: string;
  public businessUser: boolean;
  public active: boolean;
  public notLocked: boolean;
  public profileImageUrl: string;
  public lastLoginDate: Date;
  public lastLoginDateDisplay: Date;
  public joinDate: Date;
  public role: string; 
  public authorities: [];


constructor() {
      this.firstName = '';
      this.lastName = '';
      this.username = '';
      this.email = '';
      this.phone = '';
      this.street = '';
      this.city = '';
      this.province = '';
      this.country = '';
      this.businessUser = false;
      this.active = false;
      this.notLocked = false;
      this.role = '';
      this.authorities = [];
}

  
}

