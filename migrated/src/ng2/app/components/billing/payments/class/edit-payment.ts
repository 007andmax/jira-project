import { PaymentData } from './payment-Data';
import { Payment } from './payment';

export class EditPayment {
    note: string;
    paymentData: Array<PaymentData> = [];
    paymentId: string;
    date: number;
    reference: string;
    paymentMethod: string;
    constructor(data:Payment) {
        this.note = data.note;
        this.paymentData = data.paymentData;
        this.paymentId= data.id;
        this.reference = data.reference;
        this.paymentMethod = data.paymentMethod;
    }
    public getDataForRequest(data:Payment) {
        return {
            note: (this.note != data.note) ? this.note : null,
            paymentData: this.paymentData,
            paymentId: this.paymentId,
            date: this.date,
            reference: (this.reference != data.reference) ? this.reference : null,
            paymentMethod: (this.paymentMethod != data.paymentMethod) ? this.paymentMethod : null
        }
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