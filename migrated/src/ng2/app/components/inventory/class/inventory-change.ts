import { CategoryProduct } from 'src/ng2/app/interfaces/product/category-product';

export class InventoryChange {
    action:string;
    list:Array<CategoryProduct> = [];
    data:any;
    constructor(action,data,list) {
        this.action = action;
        this.list = list;
        this.data = data;
    }
}