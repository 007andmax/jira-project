export class PaymentsReportTotal {
    CASH: number;
    CHEQUE: number;
    CREDIT_CARD: number;
    DEBIT_CARD: number;
    REFUND_COMPLETED: number;
    TOTAL: number;
    WIRE_TRANSFER: number;
    constructor(data) {
        this.CASH = data.CASH;
        this.CHEQUE = data.CHEQUE;
        this.CREDIT_CARD = data.CREDIT_CARD;
        this.DEBIT_CARD = data.DEBIT_CARD;
        this.REFUND_COMPLETED = data.REFUND_COMPLETED;
        this.TOTAL = data.TOTAL;
        this.WIRE_TRANSFER = data.WIRE_TRANSFER;
    }
}