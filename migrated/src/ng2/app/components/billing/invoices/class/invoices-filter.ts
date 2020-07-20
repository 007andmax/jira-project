export class InvoicesFilter {
    companyName: any;
    endDate: any;
    invoiceNumber: any;
    limit: number= 20;
    offset: number = 0;
    sortBy: any;
    startDate: any;
    status: any;
    constructor() { }

    public getFIlter() {
        return {
            companyName: this.companyName,
            endDate: this.endDate,
            invoiceNumber: this.invoiceNumber,
            limit: this.limit,
            offset: this.offset,
            sortBy: this.sortBy,
            startDate: this.startDate,
            status: this.status,
        }
    }
    public setOffset(offset) {
        this.offset  = offset;
    }
}