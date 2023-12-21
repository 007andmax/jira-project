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
        this.item.cost_str = (this.item.cost) ? this.item.cost.toFixed(2) : "0.00";
        this.item.sale_str = (this.item.sale) ? this.item.sale.toFixed(2) : "0.00";
        this.itemOrder = itemOrder;
        this.quantity = quantity;
        this.markup = markup;
    }
    public getDataForCreate() {
        let taxes = JSON.parse(JSON.stringify(this.item.taxes));
        let item = {};
        for (const key in this.item) if (this.item[key] && key !== "taxes") item[key] = this.item[key];
        return {
            discountType: this.discountType,
            item: item,
            itemOrder: this.itemOrder,
            quantity: this.quantity,
            taxes: taxes
        }
    }
    public checkSaleCost() {
        this.validateSaleCost = this.item.sale >= this.item.cost;
    }
}