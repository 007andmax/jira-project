export class PaymentData {
    invoiceAmount: number;
    invoiceDate: number;
    invoiceId: string;
    paidAmount: number;
    invoiceNumber:string;
    constructor(invoiceAmount, invoiceDate, invoiceId, paidAmount,invoiceNumber) {
        this.invoiceAmount = invoiceAmount;
        this.invoiceDate = invoiceDate;
        this.invoiceId = invoiceId;
        this.paidAmount = paidAmount;
        this.invoiceNumber = invoiceNumber;
    }
}