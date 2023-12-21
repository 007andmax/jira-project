import { Product } from 'src/app/interfaces/product/product';
import { TicketProfileFormItemProduct } from './ticket-profile-form-item-product';
import { Tax } from 'src/class/taxes/tax';

export class TicketProfileFormProduct {
    item: TicketProfileFormItemProduct = new TicketProfileFormItemProduct();
    itemOrder: number;
    quantity: number = 1;
    serialNumber: string;
    discountAmount: number;
    discountType: string = "PERCENT";
    completed: boolean = true;
    valdiateSaleCost: boolean = true;
    taxes: Array<Tax> = [];
    user: any;
    constructor(data = null) {
        if (data) {
            this.item = new TicketProfileFormItemProduct(data.item);
            this.itemOrder = data.itemOrder;
            this.quantity = data.quantity;
            this.serialNumber = data.serialNumber;
            this.discountAmount = data.discountAmount;
            this.discountType = data.discountType;
            this.completed = data.completed;
            this.valdiateSaleCost = data.valdiateSaleCost;
            this.taxes = [...data.this.taxes, ...this.item.taxes];
        }
    }
    public getDataForAdd() {
        let item = {};
        for (const key in this.item) if (this.item[key] != null && this.item[key] != undefined && key !== "taxes") item[key] = this.item[key];
        let taxes = this.taxes.map(item => ({
            id: item.id,
            name: item.name,
            rate: item.rate,
        }));
        return {
            item: item,
            itemOrder: this.itemOrder,
            quantity: this.quantity,
            serialNumber: this.serialNumber,
            discountAmount: this.discountAmount,
            discountType: this.discountType,
            completed: this.completed,
            taxes: taxes
        }
    }
    public setTexes(data) {
        this.taxes = data;
    }
    public setData(data, index) {
        this.item = new TicketProfileFormItemProduct(data);
        this.itemOrder = index;
        this.taxes = [...this.item.taxes];
    }
    public setItemOrder(data) {
        this.itemOrder = data;
    }
}