export class NotificationQuote {
    "id": string;
    "status": string;
    "companyName": string;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
}