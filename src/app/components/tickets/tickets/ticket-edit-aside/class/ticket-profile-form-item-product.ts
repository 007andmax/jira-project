import { Product } from 'src/app/interfaces/product/product';

export class TicketProfileFormItemProduct implements Product {
    versionedId: import("../../../../../interfaces/versioned-id").VersionedId;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    company: any;
    cost: number = 0;
    cost_str: string = "0.00";
    sale: number = 0;
    sale_str: string = "0.00";
    category: import("../../../../../interfaces/product/category").Category;
    ilc: string;
    glNumber: number;
    manufacture: string;
    description: string;
    billable: boolean;
    taxes: import("../../../../../interfaces/service/tax").Tax[] = [];
    oldVersion: boolean;
    quantity: number = 1;
    active: boolean;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            if (this.cost) this.cost_str = this.cost.toFixed(2);
            this.sale_str = this.sale.toFixed(2);
        }
    }
}