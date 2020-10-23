import { InvoiceNote } from '../../billable/class/invoice-note';
import { QuoteAddProduct } from './quote-add-product';
import { QuoteAddService } from './quote-add-service';

export class QuoteAdd {
    companyId: string;
    date: number;
    description: string;
    draft: boolean;
    globalNote: InvoiceNote;
    message: string;
    number: string = "0";
    partialDeposit: string;
    purchaseOrder: string = "";
    products: Array<QuoteAddProduct> = [];
    services: Array<QuoteAddService> = [];
    recipients: Array<string> = [];
    regularNote: InvoiceNote;
    requestPayment: boolean;
    sendNotification: boolean;
    subject: string;
    validUntil: number;
    constructor() {
        
    }
    public setQuoteDate(data) {
        this.date = data;
    }
    public setExpiryDate(data) {
        this.validUntil = data;
    }

}