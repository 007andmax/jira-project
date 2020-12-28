import { PartialPayments } from './partial-payments';
import * as moment from "moment";
export class Payment {
    date: string;
    invoiceIds: Array<string> = [];
    isSendNotification: boolean = false;
    note: string = "";
    partialPayments: Array<PartialPayments> = [];
    paymentMethod: string = "CHEQUE";
    reference: string;
    constructor() {

    }
    public resetInvoiceIds() {
        this.invoiceIds = [];
    }
    public resetPartialPayments() {
        this.partialPayments = [];
    }
    public addInvoiceId(id) {
        this.invoiceIds.push(id);
    }
    public addPartialPayment(id, data) {
        this.partialPayments.push(new PartialPayments(id, data));
    }
    public setPaymentMethod(data) {
        this.paymentMethod = data;
    }
    public setDate(day, month, year, timeOffset) {
        let current = new Date();
        if (day !== current.getDate() || current.getMonth() !== (month - 1)) {
            let currentTime = current.getTime();
            let dateTechCompany = new Date(currentTime + (current.getTimezoneOffset() * 60000) + timeOffset);
            let finalDate = new Date(year, month - 1, day, dateTechCompany.getHours(), dateTechCompany.getMinutes(), dateTechCompany.getSeconds()); // timestamp from calendar
            this.date = moment(finalDate.getTime()).format("YYYY-MM-DDTHH:mm:ss");
        } else {
            let currentTime = current.getTime();
            let finalDate = new Date(currentTime + (current.getTimezoneOffset() * 60000) + timeOffset);
            this.date = moment(finalDate.getTime()).format("YYYY-MM-DDTHH:mm:ss");
        }
    }
}