import { Product } from 'src/app/model/product';
export class ShoppingCart {
    public cartDetailsId: number;
    public cartId: number;
    public product: Product;
    public discountAmount: number;
    public orderTotal: number;
    public singleDayPayableAmount: number;
    public totalRentedAmount: number;
    public quantity: number;


    constructor(){
    }
}