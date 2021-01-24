import { Category } from "./category";

export class Product {

    public productId: number;
    public productName: string;
    public description: string;
    public pictureUrl: string;
    public businessPrice: number;
    public quantity: number;
    public userPrice: number;
    public discount: number;
    public discountPercentage: number;
    public isDeleted: boolean;
    public productSize: string;
    public isFragile: boolean;
    public isFeatured: boolean;
    public isNew: boolean;
    public category: Category;
    public cartQuantity: number;
    public numAvailable: number;


}