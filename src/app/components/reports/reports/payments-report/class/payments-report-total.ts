export class PaymentsReportTotal {
    CASH: number;
    CHEQUE: number;
    CREDIT_CARD: number;
    DEBIT_CARD: number;
    REFUND_PAYMENT: number;
    TOTAL: number;
    WIRE_TRANSFER: number;
    constructor(data) {
        this.CASH = data.CASH;
        this.CHEQUE = data.CHEQUE;
        this.CREDIT_CARD = data.CREDIT_CARD;
        this.DEBIT_CARD = data.DEBIT_CARD;
        this.REFUND_PAYMENT = data.REFUND_PAYMENT;
        this.TOTAL = data.TOTAL;
        this.WIRE_TRANSFER = data.WIRE_TRANSFER;
    }
}