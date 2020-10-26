import { InvoiceNote } from '../../billable/class/invoice-note';
import { QuoteAddProduct } from './quote-add-product';
import { QuoteAddService } from './quote-add-service';
import { QuoteProduct } from './quote-product';
import { QuoteService } from './quote-service';

export class QuoteAdd {
    companyId: string;
    date: number = new Date().getTime();
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
    regularNote: InvoiceNote = new InvoiceNote();
    requestPayment: boolean;
    sendNotification: boolean;
    subject: string;
    validUntil: number = new Date().getTime();
    constructor() {

    }
    public getDataForPreview(company) {
        let totalAmount = 0;
        totalAmount += this.services.reduce((a, b) => a + b.sum, 0);
        totalAmount += this.products.reduce((a, b) => a + b.sum, 0);
        return {
            company: company,
            //createdAt: new Date().getTime(),
            date: this.date,
            description: this.description,
            number: this.number,
            // readAt: number;
            recipients: [],
            reviewNotes: [],
            //   status: string;
            subject: this.subject,
            totalAmount: totalAmount,
            validUntil: this.validUntil,
            products: this.products.map(item => new QuoteProduct({ ...item, ...item.item })),
            services: this.services.map(item => new QuoteService({ ...item, ...item.item })),
            termsAndConditions: this.globalNote.line1,
            regularNote: this.regularNote,
            message: this.message
        }
    }
    public setRegulatNote(data) {
        this.regularNote = new InvoiceNote(data);
    }
    public setGlobalNote(data) {
        this.globalNote = new InvoiceNote(data);
    }
    public addProduct(item) {
        this.products.push(new QuoteAddProduct("", item, 0, 1, this.getMarkups(item)))
    }
    public addService(item) {
        this.services.push(new QuoteAddService("", "", item, 0, 1))
    }
    public getMarkups(item) {
        if (item.sale > 0 && item.cost > 0) return Math.round((item.sale - item.cost) / item.cost * 100);
        return 0;

    }
    public setQuoteDate(data) {
        this.date = data;
    }
    public setExpiryDate(data) {
        this.validUntil = data;
    }

}