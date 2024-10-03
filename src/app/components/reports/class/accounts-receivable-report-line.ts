export class AccountsReceivableReportLineReport {
    "currentSum": number;
    "month1Sum": number;
    "month2Sum": number;
    "month3Sum": number;
    "olderSum": number;
    "totalSum": number;
    "invoiceNumber": string;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
}