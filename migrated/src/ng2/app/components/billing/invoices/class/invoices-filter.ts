export class InvoicesFilter {
    companyName: string;
    endDate: number;
    invoiceNumber: string;
    limit: number= 20;
    offset: number = 0;
    sortBy: string;
    startDate: number;
    status: string;
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
    public setLimit (data) {
        this.limit = data;
    }
    public setSortBy (data) {
        this.sortBy = data;
    }
    public setOffset(offset) {
        this.offset  = offset;
    }
    public setStatus(status) {
        this.status  = status;
    }
    public setCompany(data) {
        this.companyName = data;
    }
    public setStartDate (data) {
        this.startDate = data;
    }
    public setEndDate (data) {
        this.endDate = data;
    }
    public setInvoiceNumber(data) {
        this.invoiceNumber = data;
    }
}