import * as moment from "moment";

export class QuoteFilter {
    companyId: string;
    quoteNumber: number;
    status: string;
    date: number;
    endDate: number;
    sortBy: string;
    offset: number = 0;
    limit: number = 30;

    constructor() { }
    public setData(data) {
        this.companyId = data.companyId;
        this.quoteNumber = data.quoteNumber;
        this.status = data.status;
        this.date = data.date;
        this.endDate = data.endDate;
        this.offset = data.offset;
        this.limit = data.limit;
    }
    public isExistFilters() {
        return this.companyId || this.quoteNumber || this.status || this.date || this.endDate;
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
    public setCompanyId(data) {
        this.companyId = data;
    }
    public setQuoteNumber(data) {
        this.quoteNumber = data;
    }
    public getFIlter() {
        let endDate = new Date(this.endDate);
        endDate.setDate(endDate.getDate() + 1);
        return {
            companyId: this.companyId,
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