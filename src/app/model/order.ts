import { DeliveryType } from "../enum/delivery-type";
import { OrderStatus } from "../enum/order-status";

export class Order {
  public orderId: number;
  public orderNumber: string;
  public orderStatus: OrderStatus;
  public orderPlacedDate: Date;
  public startDate: Date;
  public endDate: Date;
  public deposit: number;
  public deliveryType: DeliveryType;
  public deliveryCharges: number;
  public originalOrderAmount: number;
  public amountAfterDiscount: number;


constructor() {
  this.orderId = 0; 
  this.orderNumber = ''; 
  this.orderStatus = OrderStatus.PENDING;   
  this.deposit = 0; 
  this.deliveryType = DeliveryType.PICK_UP;

  this.deliveryCharges = 0; 
  this.originalOrderAmount = 0; 
  this.amountAfterDiscount = 0; 
}
}


