import { Product } from 'src/ng2/app/interfaces/product/product';

export class TicketProfileFormItemProduct implements Product {
    versionedId: import("../../../../../interfaces/versioned-id").VersionedId;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    company: any;
    cost: number = 0;
    sale: number = 0;
    category: import("../../../../../interfaces/product/category").Category;
    ilc: string;
    glNumber: number;
    manufacture: string;
    description: string;
    billable: boolean;
    taxes: import("../../../../../interfaces/service/tax").Tax[];
    oldVersion: boolean;
    quantity:number = 1;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                //  if (this.hasOwnProperty(key)) {
                this[key] = data[key];

                // }
            }
        }
    }
}