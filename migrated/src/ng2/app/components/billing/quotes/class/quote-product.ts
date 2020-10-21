import { Category } from 'src/ng2/app/interfaces/product/category';
import { Product } from 'src/ng2/app/interfaces/product/product';
import { Tax } from 'src/ng2/app/interfaces/service/tax';
import { VersionedId } from 'src/ng2/app/interfaces/versioned-id';

export class QuoteProduct implements Product {
    versionedId: VersionedId;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    company: any;
    cost: number;
    sale: number;
    category: Category;
    ilc: string;
    glNumber: number;
    manufacture: string;
    description: string;
    billable: boolean;
    taxes: Tax[];
    oldVersion: boolean;
    categoryId:string;
    commissionRate:any;
    discountAmount:number;
    discountSum:number;
    discountType:string;
    itemOrder:number;
    quantity:number;
    serialNumber:string;
    serviceExpense:boolean;
    sum:number;
    taxSum:number;
    totalSum:number;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }

    }
}