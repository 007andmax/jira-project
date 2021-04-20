import { Product } from 'src/app/interfaces/product/product';

export class QuoteAddProduct {
    discountType: string;
    item: Product;
    itemOrder: number;
    quantity: number;
    markup: number;
    sum: number;
    taxSum: number;
    validateSaleCost: boolean = true;
    constructor(discountType, item, itemOrder, quantity, markup) {
        this.discountType = discountType;
        this.item = item;
        this.itemOrder = itemOrder;
        this.quantity = quantity;
        this.markup = markup;
    }
    public getDataForCreate() {
        return {
            discountType: this.discountType,
            item: this.item,
            itemOrder: this.itemOrder,
            quantity: this.quantity
        }
    }
    public checkSaleCost() {
        this.validateSaleCost = this.item.sale >= this.item.cost;
    }
}