export class ContractsOtherProduct {
    description: string;
    productId: string;
    quantity: number;
    salePrice: number;
    validate: boolean = true;
    salePrice_str: string;
    taxSum: number = 0;
    taxes: Array<any> = [];
    constructor(productId, quantity, salePrice, description) {
        this.productId = productId;
        this.quantity = quantity;
        this.salePrice = salePrice;
        this.salePrice_str = this.salePrice.toFixed(2);
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