import { Product } from 'src/ng2/app/interfaces/product/product';

export class QuoteAddProduct {
    discountType: string;
    item: Product;
    itemOrder: number;
    quantity: number;
    markup:number;
    sum:number;
    taxSum:number;
    constructor(discountType,item,itemOrder,quantity,markup) {
        this.discountType = discountType;
        this.item = item;
        this.itemOrder = itemOrder;
        this.quantity = quantity;
        this.markup = markup;
    }
}