import { Payment } from './payment';
import { Invoice } from '../../class/invoice';
import { PaymentData } from '../../../payments/class/payment-Data';

export class PaymentInvoice {
    amountReceived: boolean = true;
    cardId: boolean = true;
    constructor() { }

    public getCardId() {
        return this.cardId;
    }
    public setCardId(cardId) {
        this.cardId = cardId;
    }
    public getAmountReceived() {
        return this.amountReceived;
    }
    public checkAmountReceived(amountReceived: number, invoices: Array<Invoice>) {
        let sumAmountReceived = 0;
        invoices.forEach(item => {
            if (item.selected) sumAmountReceived += item.paymentAmount;
        })
        sumAmountReceived = parseFloat((sumAmountReceived).toFixed(2));
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
    public isValidate(amountReceived: number, invoices: Array<Invoice>, payment: Payment) {
        let sumAmountReceived = 0;
        invoices.forEach(item => {
            if (item.selected) sumAmountReceived += item.paymentAmount;
        })
        sumAmountReceived = parseFloat((sumAmountReceived).toFixed(2));
        this.amountReceived = (sumAmountReceived === parseFloat((amountReceived).toFixed(2)));
        this.cardId = (payment.paymentMethod == 'CREDIT_CARD' || payment.paymentMethod == 'DEBIT_CARD' ? payment.cardId != null : true);
        return this.amountReceived && this.cardId;
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