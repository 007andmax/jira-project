import { InventoryItem } from './inventory-item';

export class InventoryValidate {
    manufacture: boolean = true;
    description: boolean = true;
    sale: boolean = true;
    category: boolean = true;
    manufactureIsExist: boolean = true;
    ilcIsExist: boolean = true;
    constructor() { }

    public resetManufactureIsExist() {
        this.manufactureIsExist = true;
    }
    public getManufactureIsExist() {
        return this.manufactureIsExist;
    }
    public setManufactureIsExist() {
        this.manufactureIsExist = false;
    }

    public resetILCIsExist() {
        this.ilcIsExist = true;
    }
    public getILCIsExist() {
        return this.ilcIsExist;
    }
    public setILCIsExist() {
        this.ilcIsExist = false;
    }

    public resetDescription() {
        this.description = true;
    }
    public resetSale() {
        this.sale = true;
    }
    public resetCategory() {
        this.category = true;
    }

    public resetManufacture() {
        this.manufacture = true;
    }

    public getManufacture() {
        return this.manufacture;
    }
    public getDescription() {
        return this.description;
    }
    public getSale() {
        return this.sale;
    }
    public getCategory() {
        return this.category;
    }

    public checkValidManufacture(name) {
        if (!name || name.length === 0) {
            this.manufacture = false;
        } else {
            this.manufacture = true;
        }
    }
    public checkValidDescription(description) {
        if (description.length === 0) {
            this.description = false;
        } else {
            this.description = true;
        }

    }

    public checkValidSale(sale) {
        if (sale && sale.length > 0) {
            this.sale = false;
        } else {
            this.sale = true;
        }
    }

    public checkValidCategory(category) {
        if (!category) {
            this.category = false;
        } else {
            this.category = true;
        }
    }

    public isValidate(inventory: InventoryItem) {
        if (!inventory.manufacture || inventory.manufacture.length === 0) this.manufacture = false;
        if (!inventory.description || inventory.description.length === 0) this.description = false;
        if (!inventory.sale) this.sale = false;
        if (!inventory.category) this.category = false;
        return this.manufacture && this.description && this.sale && this.category && this.manufactureIsExist && this.ilcIsExist;
    }
}