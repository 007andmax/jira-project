export class RefundPayment {
    note: string = "";
    paymentId: string;
    refundMethod: string = "REFUND_PAYMENT";
    sendEmailNotification: boolean = false;
    constructor(id,note) {
        this.paymentId = id;
        this.note = note;
    }
}