export class PaymentsReportPayment {
    clientCompanyName: string;
    createdAt: number;
    id: string;
    partialPaidAmount: number;
    partialPaidInvoices: Array<string> = [];
    paymentMethod: string;
    reference: string;
    paymentStatus: string;
    constructor(data) {
        this.clientCompanyName = data.clientCompanyName;
        this.createdAt = data.createdAt;
        this.id = data.id;
        this.partialPaidAmount = data.partialPaidAmount;
        this.partialPaidInvoices = data.partialPaidInvoices;
        this.paymentMethod = data.paymentMethod;
        this.reference = data.reference;
        this.paymentStatus = data.paymentStatus;
    }
}