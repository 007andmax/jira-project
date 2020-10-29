import { InvoiceNote } from '../../billable/class/invoice-note';
import { QuoteAddProduct } from './quote-add-product';
import { QuoteAddService } from './quote-add-service';
import { QuoteProduct } from './quote-product';
import { QuoteService } from './quote-service';
import * as moment from "moment";
export class QuoteAdd {
    companyId: string;
    date: number = new Date().getTime();
    description: string;
    draft: boolean;
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
    public resetServices() {
        this.services = [];
    }
    public setCompanyId (data) {
        this.companyId = data;
    }
    public getDataForCreate(notification) {
        return {
            companyId: this.companyId,
            number: this.number,
            quoteItems: {
                type: "MIXED",
                shares: [],
                ticket: null,
                products: this.products.map(item => item.getDataForCreate()),
                services: this.services.map(item => item.getDataForCreate()),
            },
            description: this.description,
            requestPayment: false,
            draft: false,
            purchaseOrder: this.purchaseOrder,
            partialDeposit: null,
            validUntil: this.validUntil,
            date: this.date,
            recipients: this.recipients,
            message: this.message,
            subject: this.subject,
            regularNote: this.regularNote,
            sendNotification: notification
        }
    }
    public getDataForPreview(company,termsAndConditions) {
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
            termsAndConditions: termsAndConditions,
            regularNote: this.regularNote,
            message: this.message
        }
    }
    public setRegulatNote(data) {
        this.regularNote = new InvoiceNote(data);
    }
  
    public addProduct(item) {
        this.products.push(new QuoteAddProduct("PERCENT", item, 0, 1, this.getMarkups(item)))
    }
    public addService(item) {
        this.services.push(new QuoteAddService("", "PERCENT", item, 0, 1))
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