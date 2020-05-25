import { Product } from 'src/ng2/app/interfaces/product/product';
import { TicketProfileFormItemProduct } from './ticket-profile-form-item-product';

export class TicketProfileFormProduct {
    item: TicketProfileFormItemProduct = new TicketProfileFormItemProduct();
    itemOrder: number;
    quantity: number = 1;
    serialNumber: string;
    discountAmount: number;
    discountType: string = "PERCENT";
    completed: boolean = true;
    constructor() {
    }
    public setData(data, index) {
        this.item = new TicketProfileFormItemProduct(data);
        this.itemOrder = index;
    }
    public setItemOrder (data) {
        this.itemOrder  =data;
    }
}