import { InventoryValidate } from "src/app/components/inventory/class/inventory-validate";

export class TicketPreviewValidate extends InventoryValidate {
    public isValidate(inventory: any) {
        if (!inventory.description || inventory.description.length === 0) this.description = false;
        if (!inventory.sale) this.sale = false;
        return this.description && this.sale && this.manufactureIsExist && this.ilcIsExist && this.cost_sale;
    }
}