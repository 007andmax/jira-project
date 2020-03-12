import { Product } from 'src/ng2/app/interfaces/product/product';

export class InventoryItem implements Product {
    versionedId: import("../../../interfaces/versioned-id").VersionedId;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    company: any;
    cost: number;
    sale: number;
    category: import("../../../interfaces/product/category").Category;
    ilc: string;
    glNumber: number;
    manufacture: string;
    description: string;
    billable: boolean;
    taxes: import("../../../interfaces/service/tax").Tax[];
    oldVersion: boolean;
    categoryIsdefault: boolean;

    constructor(data) {
        this.versionedId = data.versionedId;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
        this.company = data.company;
        this.cost = data.cost;
        this.sale = data.sale;
        this.category = data.category;
        this.ilc = data.ilc;
        this.glNumber = data.glNumber;
        this.manufacture = data.manufacture;
        this.description = data.description;
        this.billable = data.billable;
        this.taxes = data.taxes;
        this.oldVersion = data.oldVersion;

    }

    public setCategoryDefault (data) {
        this.categoryIsdefault = data;
    }
}