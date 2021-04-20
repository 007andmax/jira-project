export class TopDashboardProductSum {
    productName: string;
    sellingAmount: number;
    constructor(data) {
        this.productName = data.productName;
        this.sellingAmount = data.sellingAmount;
    }
}