export class ContractsOtherProduct {
    description:string;
    productId: string;
    quantity: number;
    salePrice: number;
    constructor(productId,quantity,salePrice) {
        this.productId = productId;
        this.quantity = quantity;
        this.salePrice = salePrice;
    }
}