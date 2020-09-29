export class ContractsOtherProduct {
     
    productId: string;
    quantity: number;
    salePrice: number;
    validate: boolean = true;
    constructor(productId, quantity, salePrice) {
        this.productId = productId;
        this.quantity = quantity;
        this.salePrice = salePrice;
    }
    public getDataForCrate() {
        return {
            productId: this.productId,
            quantity: this.quantity,
            salePrice: this.salePrice,
        }
    }
}