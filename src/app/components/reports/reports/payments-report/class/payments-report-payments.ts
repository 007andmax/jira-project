import { PaymentsReportPayment } from "./payments-report-payment"

export class PaymentsReportPayments {
    CASH: Array<PaymentsReportPayment> = [];
    CHEQUE: Array<PaymentsReportPayment> = [];
    CREDIT_CARD: Array<PaymentsReportPayment> = [];
    DEBIT_CARD: Array<PaymentsReportPayment> = [];
    WIRE_TRANSFER: Array<PaymentsReportPayment> = [];
    constructor(data) {
        this.CASH = data.CASH.map(item => new PaymentsReportPayment(item));
        this.CHEQUE = data.CHEQUE.map(item => new PaymentsReportPayment(item));
        this.CREDIT_CARD = data.CREDIT_CARD.map(item => new PaymentsReportPayment(item));
        this.DEBIT_CARD = data.DEBIT_CARD.map(item => new PaymentsReportPayment(item));
        this.WIRE_TRANSFER = data.WIRE_TRANSFER.map(item => new PaymentsReportPayment(item));
    }
}