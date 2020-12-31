import * as moment from "moment";

export class QuoteFilter {
    companyName: string;
    quoteNumber: number;
    status: string;
    date: number;
    endDate: number;
    sortBy: string;
    offset: number = 0;
    limit: number = 30;

    constructor() { }
    public setData(data) {
        this.companyName = data.companyName;
        this.quoteNumber = data.quoteNumber;
        this.status = data.status;
        this.date = data.date;
        this.endDate = data.endDate;
        this.offset = data.offset;
        this.limit = data.limit;
    }
    public clearSortBy() {
        this.sortBy = undefined;
    }
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
        let endDate = new Date(this.endDate);
        endDate.setDate(endDate.getDate() + 1);
        return {
            companyName: this.companyName,
            quoteNumber: this.quoteNumber,
            status: this.status,
            date: (this.date) ? moment(this.date).format('YYYY-MM-DD') : null,
            endDate: (this.endDate) ? moment(endDate).format('YYYY-MM-DD') : null,
            sortBy: this.sortBy,
            offset: this.offset,
            limit: this.limit
        }
    }
}