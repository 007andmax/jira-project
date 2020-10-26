import { Service } from 'src/ng2/app/interfaces/service/service';

export class QuoteAddService {
    description: string;
    discountType: string;
    item: Service;
    itemOrder: number;
    quantity: number;
    sum:number;
    taxSum:number;
    constructor(description, discountType, item, itemOrder, quantity) {
        this.description = description;
        this.discountType = discountType;
        this.item = item;
        this.itemOrder = itemOrder;
        this.quantity = quantity;
    }

}