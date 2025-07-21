import { CompanyProfile } from '../../../companies/class/company-profile';
import { QuoteReviewNotes } from './quote-review-note';

export class Quote {
    company: CompanyProfile;
    createdAt: number;
    date: number;
    description: string;
    id: string;
    message: string;
    number: string;
    products: Array<any>;
    readAt: number;
    recipients: Array<string>;
    requestPayment: false
    reviewNotes: Array<QuoteReviewNotes>;
    services: Array<any>;
    status: string;
    subject: string;
    totalAmount: number;
    validUntil: number;
    createdBy: string;
    invoiceId: string;
    ticketId: string;
    selected: boolean = false;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            let billing = (this.company && this.company.addresses.find(item => item.isPrimary)) ? JSON.parse(JSON.stringify(this.company.addresses.find(item => item.isPrimary))) : null;
            let shipping = (this.company && this.company.addresses.find(item => !item.isPrimary)) ? JSON.parse(JSON.stringify(this.company.addresses.find(item => !item.isPrimary))) : null;
            if (this.company) this.company.addresses = [];
            if (billing && this.company) this.company.addresses = [billing];
            if (shipping && this.company) this.company.addresses.push(shipping);
            if (data.reviewNotes) this.reviewNotes = data.reviewNotes.map(item => new QuoteReviewNotes(item));
        }
    }
    public parseRecipients() {
        return this.recipients.join("<br/>");
    }
    public checkStatus(statusForShowingArray) {
        const elems = statusForShowingArray.filter((item) => item.toLowerCase() === this.status.toLowerCase());
        return elems.length > 0;
    }
}