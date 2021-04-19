import { CategoryProduct } from '../app/interfaces/product/category-product';
import { Product } from '../app/interfaces/product/product';

export class CategoryProductitem implements CategoryProduct {
    commissionRate: any;    
    default: boolean;
    id: string;
    isDefault: boolean;
    name: string;
    products: import("../app/interfaces/product/product").Product[];
    productsAmount: number;
    constructor (data) {
        this.commissionRate = data.commissionRate;    
        this.default = data.default;
        this.id = data.id;
        this.isDefault = data.isDefault;
        this.name = data.name;
        this.products = data.products.map((item) => {
            let product :Product = {
                cost: (item.cost) ? item.cost : 0,
                description: item.description,
                glNumber: item.glNumber,
                ilc: item.ilc,
                manufacture: item.manufacture,
                sale: (item.sale) ? item.sale : 0,
                taxes:item.taxes,
                versionedId: item.versionedId,
                createdAt: null,
                updatedAt: null,
                deletedAt: null,
                company: null,
                category: null,
                billable: null,
                oldVersion: null,
            }
            return product;
        });
        this.productsAmount = data.productsAmount;
    }


}