export class TechSalesItem {
    billedTime: number;
    fullName: string;
    totalSum: number;
    constructor(data) {
        this.billedTime = data.billedTime;
        this.fullName = data.fullName;
        this.totalSum = data.totalSum;
    }
}