import { Payment } from './payment';
import { Invoice } from '../../class/invoice';

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
    public isValidate(amountReceived: number, invoices: Array<Invoice>) {
        let sumAmountReceived = 0;
        invoices.forEach(item => {
            if (item.selected) sumAmountReceived += item.paymentAmount;
        })
        this.amountReceived = (sumAmountReceived === amountReceived);

        return this.amountReceived;

    }
}