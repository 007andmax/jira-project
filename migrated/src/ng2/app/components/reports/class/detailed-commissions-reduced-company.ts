import { DetailedCommissionsItem } from "./detailed-commissions-item";

export class DetailedCommissionsReducedCompanies {
    list: Array<DetailedCommissionsItem> = [];
    commissionSum: number;
    priceSum: number;
    totalSum: number;
    companyName: string;
    constructor() {

    }
    public calculate(item: DetailedCommissionsItem) {
        this.commissionSum = (this.commissionSum || 0) + item.commissionSum;
        this.priceSum = (this.priceSum || 0) + (item.productPrice || 0);
        this.totalSum = (this.totalSum || 0) + item.totalSum;
    }
}