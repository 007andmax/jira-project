export class AccountingReportInvoice {
    amount: number;
    companyId: string;
    date: number;
    source: string;
    constructor(amount,companyId,date,source) {
        this.amount = amount;
        this.companyId= companyId;
        this.date= date;
        this.source= source;
    }
}