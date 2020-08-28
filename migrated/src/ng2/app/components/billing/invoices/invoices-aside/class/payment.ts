import { PartialPayments } from './partial-payments';

export class Payment {
    date: number;
    invoiceIds: Array<string> = [];
    isSendNotification: boolean = false;
    note: string = "";
    partialPayments: Array<PartialPayments> = [];
    paymentMethod: string = "CHEQUE";
    reference :string;
    constructor() {

    }
    public resetInvoiceIds () {
        this.invoiceIds = [];
    }
    public resetPartialPayments() {
        this.partialPayments = [];
    }
    public addInvoiceId(id) {
        this.invoiceIds.push(id);
    }
    public addPartialPayment (id,data) {
        this.partialPayments.push(new PartialPayments(id,data));
    }
    public setPaymentMethod (data) {
        this.paymentMethod = data;
    }
    public setDate(day, month, year, timeOffset) {
        let current = new Date();

        if (day !== current.getDate() || current.getMonth() !== (month - 1)) {
            let dateDatePicker = new Date(year, month - 1, day).getTime(); // timestamp from calendar
            let finalDate = new Date(dateDatePicker - (current.getTimezoneOffset() * 60000/* dont touch*/) - timeOffset /* timezone.timeOffset */);
            this.date = finalDate.getTime();
        } else {
            let currentTime = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
            let finalDate = new Date(currentTime - (current.getTimezoneOffset() * 60000) - timeOffset);
            this.date = finalDate.getTime();
        }
    }
}