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
    categoryId: string;
    commissionRate: any;
    discountAmount: number;
    discountSum: number;
    discountType: string;
    itemOrder: number;
    quantity: number;
    serialNumber: string;
    serviceExpense: boolean;
    sum: number;
    taxSum: number;
    totalSum: number;
    validateSaleCost: boolean = true;
    markup: number = 0;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }

    }
    public checkSaleCost() {
        this.validateSaleCost = this.sale >= this.cost;
    }
    public getDataForUpdate() {
        let product: Product = {
            versionedId: this.versionedId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
            company: this.company,
            cost: this.cost,
            sale: this.sale,
            category: this.category,
            ilc: this.ilc,
            glNumber: this.glNumber,
            manufacture: this.manufacture,
            description: this.description,
            billable: this.billable,
            taxes: this.taxes,
            oldVersion: this.oldVersion,
        }
        return {
            discountType: this.discountType,
            item: product,
            itemOrder: this.itemOrder,
            quantity: this.quantity
        }
    }
}