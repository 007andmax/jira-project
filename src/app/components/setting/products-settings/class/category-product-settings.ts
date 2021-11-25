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
    disableUpdate: boolean = false;
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
    public checkDublicate(list) {
        var duplicate = list.filter((item) => {
            return item.name.toLowerCase() === this.name.toLowerCase() && item.id !== this.id;
        });
        console.log("duplicate", duplicate);
        if (duplicate && duplicate[0]) {
            return this.disableUpdate = true;
        } else {
            return this.disableUpdate = false;
        }
    };
}