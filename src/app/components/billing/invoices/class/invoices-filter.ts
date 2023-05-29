import { Invoice } from './invoice';
import * as moment from "moment";

export class InvoicesFilter {
    companyId: string;
    endDate: number;
    invoiceNumber: string;
    limit: number = 40;
    offset: number = 0;
    amount: string = "";
    sortBy: string;
    startDate: number;
    status: string;

    leftOffset: number = 0;
    initLeftOffset: boolean = false;
    constructor() { }

    public resetSortBy() {
        this.sortBy = null;
    }
    public onInitLeftOffset(data) {
        this.initLeftOffset = data;
    }
    public updateLeftOffset() {
        this.leftOffset += 1;
    }
    public resetLeftOffset() {
        this.leftOffset = 0;
    }
    public getFIlter() {
        let endDate = new Date(this.endDate);
        endDate.setDate(endDate.getDate() + 1);
        return {
            companyId: this.companyId,
            amount: (this.amount) ? this.amount : null,
            endDate: (this.endDate) ? moment(endDate).format('YYYY-MM-DD') : null,
            invoiceNumber: this.invoiceNumber,
            limit: this.limit,
            offset: (this.initLeftOffset) ? (this.offset - this.leftOffset) : this.offset,
            sortBy: this.sortBy,
            startDate: (this.startDate) ? moment(this.startDate).format('YYYY-MM-DD') : null,
            status: this.status,
        }
    }
    public checkAddInvoice(invoice: Invoice, companies) {
        let company = companies.find(item => item.id === this.companyId);
        if ((company) ? invoice.companyId === company.id : true
            && (this.invoiceNumber) ? invoice.ticketNumbers.includes(this.invoiceNumber) : true
                && (this.status) ? invoice.status === this.status : true
                    && (this.startDate && this.endDate) ? new Date(invoice.date).getTime() >= this.startDate && new Date(invoice.date).getTime() <= this.endDate : true) return true;
        return false;
    }
    public setLimit(data) {
        this.limit = data;
    }
    public setSortBy(data) {
        this.sortBy = data;
    }
    public setOffset(offset) {
        this.offset = offset;
    }
    public setStatus(status) {
        this.status = status;
    }
    public setCompanyId(data) {
        this.companyId = data;
    }
    public setStartDate(data) {
        this.startDate = data;
    }
    public setEndDate(data) {
        this.endDate = data;
    }
    public setInvoiceNumber(data) {
        this.invoiceNumber = data;
    }
    public setAmount(data) {
        this.amount = data;
    }
}