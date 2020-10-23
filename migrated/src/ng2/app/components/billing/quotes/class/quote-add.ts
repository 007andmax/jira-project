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
    public addProduct(item) {
        this.products.push(new QuoteAddProduct("",item,0,1,this.getMarkups(item)))
    }
    public addService(item) {
        this.services.push(new QuoteAddService("","",item,0,1))
    }
    public getMarkups(item) {
        if (item.sale > 0 && item.cost > 0 )  return Math.round((item.sale - item.cost)/item.cost* 100);
        return 0;
         
      }
    public setQuoteDate(data) {
        this.date = data;
    }
    public setExpiryDate(data) {
        this.validUntil = data;
    }

}