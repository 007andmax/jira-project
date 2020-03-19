import { Product } from 'src/ng2/app/interfaces/product/product';
import { GlNumber } from 'src/ng2/class/gl-number/gl-number';
import { InventoryCategory } from './inventory-category';
import { reqInventoryAdd } from 'src/ng2/app/interfaces/inventory/req-inventory-add';
import { reqInventoryEdit } from 'src/ng2/app/interfaces/inventory/req-inventory-edit';

export class InventoryItem {
    versionedId: import("../../../interfaces/versioned-id").VersionedId;
    cost: number;
    sale: number;
    ilc: string;
    manufacture: string;
    glNumber: GlNumber;
    description: string;
    category: InventoryCategory;
    companyId: string;
    billable: boolean;
    taxIds: Array<String>
    constructor(data = null) {
        if (data != null) {
            this.versionedId = data.versionedId;
            this.cost = data.cost;
            this.sale = data.sale;
            this.ilc = data.ilc;
            this.manufacture = data.manufacture;
            this.glNumber = data.glNumber;
            this.description = data.description;
            this.category = new InventoryCategory(data.category);
            this.companyId = data.companyId;
            this.billable = data.billable;
            this.taxIds = data.taxIds;

        }

    }
   

    public getForAdd() {
        let item: reqInventoryAdd = {
            cost: this.cost,
            sale: this.sale,
            ilc: this.ilc,
            manufacture: this.manufacture,
            description: this.description,
            companyId: this.companyId,
            taxIds: this.taxIds,
            categoryId: (this.category) ? this.category.id : null,
            glNumber:  (this.glNumber && this.glNumber.id) ? { id: this.glNumber.id } : null,
        }
        return item;
    }
    public getForEdit() {
        let item: reqInventoryEdit = {
            versionedId: this.versionedId,
            cost: this.cost,
            sale: this.sale,
            ilc: this.ilc,
            manufacture: this.manufacture,
            description: this.description,
            companyId: this.companyId,
            taxIds: this.taxIds,
            categoryId: (this.category) ? this.category.id : null,
            glNumber: (this.glNumber && this.glNumber.id) ? { id: this.glNumber.id } : null,
        }
        return item;
    }


}