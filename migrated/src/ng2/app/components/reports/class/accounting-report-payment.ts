export class AccountingReportPayment {
    amount: number;
    companyId: string;
    date: number;
    reference: string;
    source: string;
    constructor(amount, companyId, date, reference, source) {
        this.amount = amount
        this.companyId = companyId;
        this.date = date;
        this.reference = reference;
        this.source = source;
    }
}