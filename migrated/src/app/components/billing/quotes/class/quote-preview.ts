import { CompanyProfile } from '../../../companies/class/company-profile';
import { InvoiceNote } from '../../billable/class/invoice-note';
import { Quote } from './quote'
import { QuoteProduct } from './quote-product';
import { QuoteService } from './quote-service';

export class QuotePreview extends Quote {
    products: Array<QuoteProduct> = [];
    services: Array<QuoteService> = []
    termsAndConditions: string;
    regularNote: InvoiceNote;
    message: string;
    purchaseOrder: string;
    constructor(data = null) {
        super();
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.products = data.products.map(item => new QuoteProduct(item));
            this.services = data.services.map(item => new QuoteService(item));
            if (data.regularNote) this.regularNote = new InvoiceNote(data.regularNote);
        }
    }
    public getDataForUpdate(notification) {
        return {
            companyId: this.company.id,
            number: this.number,
            quoteItems: {
                type: "MIXED",
                shares: [],
                ticket: null,
                products: this.products.map(item => item.getDataForUpdate()),
                services: this.services.map(item => item.getDataForUpdate()),
            },
            id: this.id,
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
    public setStatus(data) {
        this.status = data;
    }
    public uppdate(data) {
        this.company = data.company;
        //  this.products = data.company;
        // this.services = data.company;
        this.createdAt = data.createdAt;
        this.date = data.date;
        this.description = data.description;
        this.id = data.id;
        this.message = data.message;
        this.number = data.number;
        this.readAt = data.readAt;
        this.recipients = data.recipients;
        this.requestPayment = data.requestPayment;
        this.reviewNotes = data.reviewNotes;
        this.status = data.status;
        this.subject = data.subject;
        this.totalAmount = data.totalAmount;
        this.validUntil = data.validUntil;
        this.createdBy = data.createdBy;
        this.invoiceId = data.invoiceId;
        this.ticketId = data.ticketId;
    }

}