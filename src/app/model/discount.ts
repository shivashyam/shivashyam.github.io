export class Discount {

    public discountId: number;
    public couponCode: string;
    public discountPercentage: number;
    public discountAmount: number;
    public startDate: Date;
    public endDate: Date;
    public isExpired: boolean;
    public isValidForever: boolean;

}