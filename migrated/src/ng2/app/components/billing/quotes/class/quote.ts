import { CompanyProfile } from '../../../companies/class/company-profile';

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
    reviewNotes: Array<any>;
    services: Array<any>;
    status: string;
    subject: string;
    totalAmount: number;
    validUntil: number;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }

        }
    }
}