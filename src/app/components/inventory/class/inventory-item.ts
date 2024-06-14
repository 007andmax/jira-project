import { GlNumber } from 'src/class/gl-number/gl-number';
import { InventoryCategory } from './inventory-category';
import { reqInventoryAdd } from 'src/app/interfaces/inventory/req-inventory-add';
import { reqInventoryEdit } from 'src/app/interfaces/inventory/req-inventory-edit';
export class InventoryItem {
    versionedId: import("../../../interfaces/versioned-id").VersionedId;
    cost: number = 0;
    cost_str: string = "0.00";
    sale: number = 0;
    sale_str: string = "0.00";
    ilc: string;
    manufacture: string;
    glNumber: GlNumber;
    description: string;
    category: InventoryCategory;
    companyId: string;
    billable: boolean;
    taxIds: Array<String>
    markup: number = 0;
    active: boolean = true;
    isEdit: boolean = false;
    productType: any;
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
            this.active = data.active;
            this.productType = data.productType;
            if (this.cost) this.cost_str = this.cost.toFixed(2);
            if (this.sale) this.sale_str = this.sale.toFixed(2);
        }
    }
    public setProductType(data) {
        this.productType = data;
    }
    public setIsEdit(data) {
        this.isEdit = data;
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
            active: this.active,
            categoryId: (this.category) ? this.category.id : null,
            glNumber: (this.glNumber && this.glNumber.id) ? { id: this.glNumber.id } : null,
            productType: this.productType
        }
        return item;
    }
    public setActive(data) {
        this.active = data;
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
            active: this.active,
            categoryId: (this.category) ? this.category.id : null,
            glNumber: (this.glNumber && this.glNumber.id) ? { id: this.glNumber.id } : null,
            productType: this.productType
        }
        return item;
    }
    public isFindGlNumber(text) {
        if (!this.glNumber) return false;
        return this.glNumber.glNumber.toLowerCase().includes(text.toLowerCase());
    }
}