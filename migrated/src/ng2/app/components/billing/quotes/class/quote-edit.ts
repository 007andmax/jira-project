import { InvoiceNote } from '../../billable/class/invoice-note';
import { QuotePreview } from './quote-preview';
import { QuoteProduct } from './quote-product';
import { QuoteService } from './quote-service';

export class QuoteEdit extends QuotePreview {
  

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
            id:this.id,
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
            globalNote: this.termsAndConditions,
            regularNote: this.regularNote,
            sendNotification: notification
        }
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
            products: this.products,
            services: this.services,
            termsAndConditions: this.termsAndConditions,
            regularNote: this.regularNote,
            message: this.message
        }
    }
    public resetServices() {
        this.services = [];
    }
    public setCompany(data) {
        this.company = data;
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
    public setRegulatNote(data) {
        this.regularNote = new InvoiceNote(data);
    }
    public addProduct(item) {
        this.products.push(new QuoteProduct({ ...item, discountType: "PERCENT", itemOrder: 0, quantity: 1, markup: this.getMarkups(item) }));
    }
    public getMarkups(item) {
        if (item.sale > 0 && item.cost > 0) return Math.round((item.sale - item.cost) / item.cost * 100);
        return 0;

    }
    public addService(item) {
        this.services.push(new QuoteService({...item,discountType: "PERCENT", itemOrder: 0, quantity: 1}));
    }
}