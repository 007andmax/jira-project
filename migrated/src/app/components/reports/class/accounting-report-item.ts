export class AccountingReportItem {
    amount: number;
    companyId: string;
    date: number;
    reference: string;
    source: string;
    type:string;
    constructor(amount, companyId, date, reference, source,type) {
        this.amount = amount
        this.companyId = companyId;
        this.date = date;
        this.reference = reference;
        this.source = source;
        this.type = type;
    }
}