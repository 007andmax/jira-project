import { Payment } from './payment';
import { Invoice } from '../../class/invoice';
import { PaymentData } from '../../../payments/class/payment-Data';

export class PaymentInvoice {
    amountReceived: boolean = true;
    payment: boolean = true;
    constructor() { }

    public getAmountReceived() {
        return this.amountReceived;
    }
    public getPayment() {
        return this.payment;
    }
    public setValidPayment(data) {
        this.payment = data;
    }
    public checkAmountReceived(amountReceived: number, invoices: Array<Invoice>) {
        let sumAmountReceived = 0;
        invoices.forEach(item => {
            if (item.selected) sumAmountReceived += item.paymentAmount;
        })
        sumAmountReceived = parseFloat((sumAmountReceived).toFixed(2));
        console.log("sumAmountReceived", sumAmountReceived);
        console.log("amountReceived", amountReceived);
        this.amountReceived = (sumAmountReceived === amountReceived);
    }
    public checkAmountReceivedEditAside(amountReceived: number, paymentData: Array<PaymentData>) {
        let sumAmountReceived = 0;
        paymentData.forEach(item => {
            sumAmountReceived += item.paidAmount;
        })
        sumAmountReceived = parseFloat((sumAmountReceived).toFixed(2));
        this.amountReceived = (sumAmountReceived === amountReceived);
    }
    public isValidate(amountReceived: number, invoices: Array<Invoice>) {
        let sumAmountReceived = 0;
        invoices.forEach(item => {
            if (item.selected) sumAmountReceived += item.paymentAmount;
        })
        sumAmountReceived = parseFloat((sumAmountReceived).toFixed(2));
        this.amountReceived = (sumAmountReceived === amountReceived);
        console.log("sumAmountReceived", sumAmountReceived);
        console.log("amountReceived", amountReceived);
        return this.amountReceived;

    }
    public isValidateEditAside(amountReceived: number, paymentData: Array<PaymentData>) {
        let sumAmountReceived = 0;
        paymentData.forEach(item => {
            sumAmountReceived += item.paidAmount;
        })
        sumAmountReceived = parseFloat((sumAmountReceived).toFixed(2));
        this.amountReceived = (sumAmountReceived === amountReceived);

        return this.amountReceived;

    }
}