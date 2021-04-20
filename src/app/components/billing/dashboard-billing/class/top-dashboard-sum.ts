export class TopDashboardSum {
    companyName: string;
    invoicesSum: number;
    constructor(data) {
        this.companyName = data.companyName;
        this.invoicesSum = data.invoicesSum;
    }
}