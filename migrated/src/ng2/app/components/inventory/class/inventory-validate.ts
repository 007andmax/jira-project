import { InventoryItem } from './inventory-item';

export class InventoryValidate {
    description: boolean = true;
    sale: boolean = true;
    cost_sale: boolean = true;
    category: boolean = true;
    manufactureIsExist: boolean = true;
    ilcIsExist: boolean = true;
    constructor() { }

    public resetCostSale() {
        this.cost_sale = true;
    }
    public getCostSale() {
        return this.cost_sale;
    }
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

    public getDescription() {
        return this.description;
    }
    public getSale() {
        return this.sale;
    }
    public getCategory() {
        return this.category;
    }
    public checkPriceCost(price, cost) {
        console.log("price",price);
        console.log("cost",cost);
        cost = (!cost) ? 0 : cost;
        this.cost_sale = (Number(price) >= Number(cost)) ? true : false;
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
        if (!inventory.description || inventory.description.length === 0) this.description = false;
        if (!inventory.sale) this.sale = false;
        if (!inventory.category) this.category = false;
        return this.description && this.sale && this.category && this.manufactureIsExist && this.ilcIsExist && this.cost_sale;
    }
}