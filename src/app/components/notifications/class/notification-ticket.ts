export class NotificationTicket {
    "id": string;
    "number": string;
    "subject": string;
    "companyName": string;
    "createdAt": number;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
}