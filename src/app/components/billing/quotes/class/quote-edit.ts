import { InvoiceNote } from '../../billable/class/invoice-note';
import { QuotePreview } from './quote-preview';
import { QuoteProduct } from './quote-product';
import { QuoteService } from './quote-service';

export class QuoteEdit extends QuotePreview {
    billTo: string;
    shipTo: string;
    public setBillTo(data) {
        this.billTo = data;
    }
    public setShipTo(data) {
        this.shipTo = data;
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
            note: this.note,
            sendNotification: notification,
            billTo: this.billTo,
            shipTo: this.shipTo
        }
    }
    public calculateServiceDiscount() {
        let sum = 0;
        this.services.forEach(item => {
            if (item.discountType == "PERCENT") sum += (item.quantity * item.rate * (Number(item.discountAmount) || 0) / 100);
            if (item.discountType == "FIXED") sum += (Number(item.discountAmount) || 0);
        })
        return sum;
    }
    public getDataForPreview(company) {
        let totalAmount = 0;
        totalAmount += this.services.reduce((a, b) => a + b.sum + b.taxSum, 0);
        totalAmount += this.products.reduce((a, b) => a + b.sum + b.taxSum, 0);
        totalAmount -= this.calculateServiceDiscount();
        return {
            company: this.company,
            date: this.date,
            description: this.description,
            number: this.number,
            recipients: [],
            reviewNotes: [],
            subject: this.subject,
            totalAmount: totalAmount,
            validUntil: this.validUntil,
            products: this.products,
            services: this.services,
            termsAndConditions: this.termsAndConditions,
            note: this.note,
            message: this.message,
            billingAddress: this.billingAddress,
            shippingAddress: this.shippingAddress,
            shippingLocationName: this.shippingLocationName,
            billingLocationName: this.billingLocationName
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
        this.note = data;
    }
    public addProduct(item) {
        this.products.push(new QuoteProduct({ ...item, discountType: "PERCENT", itemOrder: 0, quantity: 1, markup: this.getMarkups(item) }));
    }
    public getMarkups(item) {
        if (item.sale > 0 && item.cost > 0) return Number(this.roundToTwo((item.sale - item.cost) / item.cost * 100));
        return 0;
    }
    public roundToTwo(num) {
        return parseFloat((Math.round(Number(num + 'e+2')) + "e-2")).toFixed(2);
    }
    public addService(item) {
        this.services.push(new QuoteService({ ...item, discountType: "PERCENT", itemOrder: 0, quantity: 1 }));
    }
}