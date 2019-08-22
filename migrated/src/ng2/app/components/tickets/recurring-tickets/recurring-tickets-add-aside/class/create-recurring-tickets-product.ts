export class CreateRecurringTicketsProduct {
    productId:string;
    quantity: number;
    discount: number;
    constructor (productId,quantity,discount) {
        this.productId = productId;
        this.quantity = quantity;
        this.discount = discount;
    }
}