import { InvoiceNote } from '../../billable/class/invoice-note';
import { QuoteAddProduct } from './quote-add-product';
import { QuoteAddService } from './quote-add-service';
import { QuoteProduct } from './quote-product';
import { QuoteService } from './quote-service';
import { QuotePreview } from './quote-preview';
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
    public checkValidateServicesByCompany(services) {
        this.services.forEach(item => {
            let find = services.find(service => service.versionedId.id === item.item.versionedId.id);
            if (!find) item.validate = false;
        })
    }
    public setCopyData(quote: QuotePreview) {
        this.companyId = quote.company.id;
        this.date = quote.date;
        this.description = quote.description;
        this.number = quote.number;
        this.purchaseOrder = quote.purchaseOrder;
        this.products = quote.products.map(item => new QuoteAddProduct("PERCENT", item, item.itemOrder, item.quantity, this.getMarkups(item)));
        this.services = quote.services.map(item => new QuoteAddService(item.description, "PERCENT", item, item.itemOrder, item.quantity));
        this.regularNote = quote.regularNote;
        this.requestPayment = quote.requestPayment;
        this.validUntil = quote.validUntil;
    }
    public resetServices() {
        this.services = [];
    }
    public setCompanyId(data) {
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
    public getDataForPreview(company, termsAndConditions) {
        let totalAmount = 0;
        totalAmount += this.services.reduce((a, b) => a + b.sum, 0);
        totalAmount += this.products.reduce((a, b) => a + b.sum, 0);
        return {
            company: company,
            date: this.date,
            description: this.description,
            number: this.number,
            recipients: [],
            reviewNotes: [],
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
    public setQuoteDate(day, month, year, timeOffset) {
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
    public setExpiryDate(day, month, year, timeOffset) {
        let current = new Date();
        if (day !== current.getDate() || current.getMonth() !== (month - 1)) {
            let dateDatePicker = new Date(year, month - 1, day).getTime(); // timestamp from calendar
            let finalDate = new Date(dateDatePicker - (current.getTimezoneOffset() * 60000/* dont touch*/) - timeOffset /* timezone.timeOffset */);
            this.validUntil = finalDate.getTime();
        } else {
            let currentTime = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
            let finalDate = new Date(currentTime - (current.getTimezoneOffset() * 60000) - timeOffset);
            this.validUntil = finalDate.getTime();
        }
    }

}