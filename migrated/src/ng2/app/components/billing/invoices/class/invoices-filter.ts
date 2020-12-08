import { Invoice } from './invoice';
import * as moment from "moment";

export class InvoicesFilter {
    companyName: string;
    endDate: number;
    invoiceNumber: string;
    limit: number = 20;
    offset: number = 0;
    sortBy: string;
    startDate: number;
    status: string;
    constructor() { }

    public getFIlter() {
        let endDate = new Date(this.endDate);
        endDate.setDate(endDate.getDate() + 1);
        return {
            companyName: this.companyName,
            endDate: (this.endDate) ? moment(endDate).format('YYYY-MM-DD') : null,
            invoiceNumber: this.invoiceNumber,
            limit: this.limit,
            offset: this.offset,
            sortBy: this.sortBy,
            startDate: (this.startDate) ? moment(this.startDate).format('YYYY-MM-DD') : null,
            status: this.status,
        }
    }
    public checkAddInvoice(invoice: Invoice, companies) {
        let company = companies.find(item => item.name === this.companyName);
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
    public setCompany(data) {
        this.companyName = data;
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
}