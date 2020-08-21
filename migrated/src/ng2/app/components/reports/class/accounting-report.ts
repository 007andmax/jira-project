import { AccountingReportInvoice } from './accounting-report-invoice';
import { AccountingReportPayment } from './accounting-report-payment';
import { AccountingReportItem } from './accounting-report-item';

export class AccountingReport {
    startDate: string = '';
    endDate: string = '';
    companyId: string;
    invoicesTotalSum: number;
    paymentsAmount: number;
    list:Array<AccountingReportItem> = [];
    constructor() {

    }
    public setData(data) {
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.companyId = data.companyId;
        this.invoicesTotalSum = data.invoicesTotalSum;
        this.paymentsAmount = data.paymentsAmount;
        this.list = data.list;
    }
    public setDataFromRequest(data) {
        let invoices = data.invoices.map(item => {
            return new AccountingReportItem(item.amount, item.companyId, item.date, "", item.source,"INVOICE");
        });
        this.invoicesTotalSum = data.invoicesTotalSum;
        this.paymentsAmount = data.paymentsAmount;
        let payments = data.payments.map(item => {
            return new AccountingReportItem(item.amount, item.companyId, item.date, item.reference, item.source, "PAYMENT");
        });
        this.list = [...invoices,...payments];
        this.list.sort((a, b) => (a.date > b.date) ?
        1 : ((b.date > a.date) ? -1 : 0));
    }
    public setList (data) {
        this.list = data;
    }
    public setInvoicesTotalSum(data) {
        this.invoicesTotalSum = data;
    }
    public setPaymentsAmount(data) {
        this.paymentsAmount = data;
    }
    public getForRequest() {
        return {
            startDate: this.startDate,
            endDate: this.endDate,
            companyId: this.companyId
        }

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
    public resetDates() {
        this.startDate = '';
        this.endDate = '';
    }
}