export class InvoiceRevenue {
    startDate: string;
    endDate: string;
    companyId: string;
    collectedSum: number = 0;
    invoicedSum: number = 0;
    outstandingSum: number = 0;
    constructor() {

    }
    public setData(data) {
        this.collectedSum = data.collectedSum;
        this.invoicedSum = data.invoicedSum;
        this.outstandingSum  = data.outstandingSum;
    }
    public getDataForRequest() {
        return {
            startDate: this.startDate,
            endDate: this.endDate,
            companyId: this.companyId,
        }
    }
    public getTotal() {
        return this.collectedSum + this.invoicedSum + this.outstandingSum;
    }
}