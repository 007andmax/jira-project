import { CategoryProduct } from "src/app/interfaces/product/category-product";
import { Product } from "src/app/interfaces/product/product";

export class CategoryProductSettings implements CategoryProduct {
    commissionRate: any;
    default: boolean;
    id: string;
    isDefault: boolean;
    name: string;
    products: Product[];
    productsAmount: number;
    isInitEdit: boolean = false;
    selected: boolean = false;
    constructor(data) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }

        }
    }
    public onInitEdit(data) {
        this.isInitEdit = data;
    }
}