export class Category {

    public categoryId: number;
    public categoryName: string;
    public description: string;
    public isActive: boolean;


    constructor(){
        this.categoryName = '';
        this.description = '';
        this.isActive = false;
    }
}