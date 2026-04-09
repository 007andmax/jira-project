export class ContractsOtherProduct {
    description: string;
    versionedId: any;
    quantity: number;
    salePrice: number;
    validate: boolean = true;
    salePrice_str: string;
    taxSum: number = 0;
    taxes: Array<any> = [];
    "discountAmount": number;
    "discountType": string = "PERCENT";
    discountSum: number;
    constructor(versionedId, quantity, salePrice, description, taxes = [], discountAmount = null, discountSum = 0, discountType = "PERCENT") {
        this.versionedId = versionedId;
        this.quantity = quantity;
        this.salePrice = salePrice;
        this.salePrice_str = this.salePrice.toFixed(2);
        this.description = description;
        this.taxes = taxes;
        this.discountAmount = discountAmount;
        this.discountSum = discountSum;
        if (discountType) this.discountType = discountType;
    }
    public getDataForCrate() {
        return {
            versionedId: this.versionedId,
            quantity: this.quantity,
            salePrice: this.salePrice,
            discountAmount: this.discountAmount ? this.discountAmount : undefined,
            discountType: this.discountAmount ? this.discountType : undefined
        }
    }
}