export class PartialPayments {
    invoiceId: string;
    paidAmount: number;
    constructor(invoiceId, paidAmount) {
        this.invoiceId = invoiceId;
        this.paidAmount = paidAmount;
    }
}