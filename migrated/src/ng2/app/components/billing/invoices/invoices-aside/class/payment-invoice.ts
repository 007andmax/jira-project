import { Payment } from './payment';
import { Invoice } from '../../class/invoice';
import { PaymentData } from '../../../payments/class/payment-Data';

export class PaymentInvoice {
    amountReceived: boolean = true;
    constructor() { }

    public getAmountReceived() {
        return this.amountReceived;
    }
    public checkAmountReceived(amountReceived: number, invoices: Array<Invoice>) {
        let sumAmountReceived = 0;
        invoices.forEach(item => {
            if (item.selected) sumAmountReceived += item.paymentAmount;
        })
        this.amountReceived = (sumAmountReceived === amountReceived);
    }
    public checkAmountReceivedEditAside(amountReceived: number, paymentData: Array<PaymentData>) {
        let sumAmountReceived = 0;
        paymentData.forEach(item => {
             sumAmountReceived += item.paidAmount;
        })
        this.amountReceived = (sumAmountReceived === amountReceived);
    }
    public isValidate(amountReceived: number, invoices: Array<Invoice>) {
        let sumAmountReceived = 0;
        invoices.forEach(item => {
            if (item.selected) sumAmountReceived += item.paymentAmount;
        })
        this.amountReceived = (sumAmountReceived === amountReceived);

        return this.amountReceived;

    }
}