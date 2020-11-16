import { Service } from 'src/ng2/app/interfaces/service/service';

export class QuoteAddService {
    description: string;
    discountType: string;
    item: Service;
    itemOrder: number;
    quantity: number;
    sum: number;
    taxSum: number;
    validate: boolean = true;
    constructor(description, discountType, item, itemOrder, quantity) {
        this.description = description;
        this.discountType = discountType;
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
        return {
            description: this.description,
            discountType: this.discountType,
            item: this.item,
            itemOrder: this.itemOrder,
            quantity: this.quantity
        }
    }
}