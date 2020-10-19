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
    public setOffset(offset) {
        this.offset = offset;
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