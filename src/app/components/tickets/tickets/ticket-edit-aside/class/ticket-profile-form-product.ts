import { Product } from 'src/app/interfaces/product/product';
import { TicketProfileFormItemProduct } from './ticket-profile-form-item-product';

export class TicketProfileFormProduct {
    item: TicketProfileFormItemProduct = new TicketProfileFormItemProduct();
    itemOrder: number;
    quantity: number = 1;
    serialNumber: string;
    discountAmount: number;
    discountType: string = "PERCENT";
    completed: boolean = true;
    valdiateSaleCost: boolean = true;
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
        }
    }
    public getDataForAdd() {
        let item = JSON.parse(JSON.stringify(this.item));
        item.taxes = item.taxes.map(item => ({
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
        }
    }
    public setTexes(data) {
        this.item.taxes = data;
    }
    public setData(data, index) {
        this.item = new TicketProfileFormItemProduct(data);
        this.itemOrder = index;
    }
    public setItemOrder(data) {
        this.itemOrder = data;
    }
}