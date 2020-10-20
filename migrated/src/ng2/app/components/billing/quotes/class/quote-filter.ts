export class QuoteFilter {
    companyName: string;
    quoteNumber: number;
    status: string;
    date: number;
    endDate: number;
    sortBy: string = "DATE_DESC";
    offset: number = 0;
    limit: number = 30;
    constructor() { }
    public setStatus(data) {
        this.status = data;
    }
    public setOffset(offset) {
        this.offset = offset;
    }
    public setEndDate(data) {
        this.endDate = data;
    }
    public setStartDate(data) {
        this.date = data;
    }
    public setCompanyName(data) {
        this.companyName = data;
    }
    public setQuoteNumber(data) {
        this.quoteNumber = data;
    }
    public getFIlter() {
        return {
            companyName: this.companyName,
            quoteNumber: this.quoteNumber,
            status: this.status,
            date: this.date,
            endDate: this.endDate,
            sortBy: this.sortBy,
            offset: this.offset,
            limit: this.limit
        }
    }
}