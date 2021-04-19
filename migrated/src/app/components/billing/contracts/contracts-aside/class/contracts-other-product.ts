export class ContractsOtherProduct {
    description:string;
    productId: string;
    quantity: number;
    salePrice: number;
    validate: boolean = true;
    constructor(productId, quantity, salePrice,description) {
        this.productId = productId;
        this.quantity = quantity;
        this.salePrice = salePrice;
        this.description = description;
    }
    public getDataForCrate() {
        return {
            productId: this.productId,
            quantity: this.quantity,
            salePrice: this.salePrice,
        }
    }
}