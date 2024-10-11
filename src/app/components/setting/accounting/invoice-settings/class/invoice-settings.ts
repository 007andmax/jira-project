import { PhoneNumber } from "src/class/phone-number";

export class InvoiceSettings {
    "invoiceContact": {
        "enabled": boolean,
        "firstName": string,
        "lastName": string,
        "email": string,
        "designation": string,
        "phoneNumbers": Array<PhoneNumber>,
        "enableContactSending": boolean,
    };
    "enableOwnerSending": boolean;
    "includeInvoiceAsAttachmentSetting": boolean;
    "includeAccountReceivableReportAsAttachmentSetting": boolean;
    "term": string;
    "condition": string;
    "number": string;
    "taxIdDescription": string;
    "taxId": string;
    "defaultPaymentMethod": string;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
}