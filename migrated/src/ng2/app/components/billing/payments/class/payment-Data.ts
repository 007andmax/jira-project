export class PaymentData {
    invoiceAmount: number;
    invoiceDate: number;
    invoiceId: string;
    paidAmount: number;
    constructor(invoiceAmount, invoiceDate, invoiceId, paidAmount) {
        this.invoiceAmount = invoiceAmount;
        this.invoiceDate = invoiceDate;
        this.invoiceId = invoiceId;
        this.paidAmount = paidAmount;
    }
}