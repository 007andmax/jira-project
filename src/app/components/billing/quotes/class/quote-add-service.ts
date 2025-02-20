import { Service } from 'src/app/interfaces/service/service';

export class QuoteAddService {
    description: string;
    discountType: string;
    discountAmount: number;
    item: Service;
    itemOrder: number;
    quantity: number;
    sum: number;
    taxSum: number;
    validate: boolean = true;
    constructor(description, discountType, discountAmount, item, itemOrder, quantity) {
        this.description = description;
        this.discountType = discountType;
        this.discountAmount = discountAmount;
        this.item = item;
        this.itemOrder = itemOrder;
        this.quantity = quantity;
    }
    public setItem(data) {
        this.item = data;
    }
    public setValdiate(data) {
        this.validate = data;
    }
    public getDataForCreate() {
        let taxes = JSON.parse(JSON.stringify(this.item.taxes));
        let item = {};
        for (const key in this.item) if (this.item[key] && key !== "taxes") item[key] = this.item[key];
        return {
            description: this.description,
            discountType: this.discountType,
            discountAmount: this.discountAmount,
            item: item,
            itemOrder: this.itemOrder,
            quantity: this.quantity,
            taxes: taxes
        }
    }
}