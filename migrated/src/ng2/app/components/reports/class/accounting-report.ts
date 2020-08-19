import { AccountingReportInvoice } from './accounting-report-invoice';
import { AccountingReportPayment } from './accounting-report-payment';

export class AccountingReport {
    startDate: string = '';
    endDate: string = '';
    companyId: string;
    invoices: Array<AccountingReportInvoice> = [];
    invoicesTotalSum: number;
    paymentsAmount: number;
    payments: Array<AccountingReportPayment> = [];
    constructor() {

    }
    public setData(data) {
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.companyId = data.companyId;
        this.invoices = data.invoices.map(item => {
            return new AccountingReportInvoice(item.amount,item.companyId,item.date,item.source);
        });
        this.invoicesTotalSum = data.invoicesTotalSum;
        this.paymentsAmount = data.paymentsAmount;
        this.payments = data.payments.map(item => {
            return new AccountingReportPayment(item.amount, item.companyId, item.date, item.reference, item.source);
        });
    }
    public setInvoices(data) {
        this.invoices = data;
    }
    public setInvoicesTotalSum(data) {
        this.invoicesTotalSum = data;
    }
    public setPaymentsAmount(data) {
        this.paymentsAmount = data;
    }
    public setPayments(data) {
        this.payments = data;
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