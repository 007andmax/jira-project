import { NotificationProduct } from "./notification-product";
import { NotificationService } from "./notification-service";
import { NotificationTicket } from "./notification-ticket";

export class Notification {
    "id": string;
    "date": number;
    "title": string;
    "note": string;
    "type": string;
    "read": boolean;
    "ticket": NotificationTicket;
    "service": NotificationService;
    "product": NotificationProduct;
    shortNote: string;
    showMoreNote: boolean = false;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
        this.ticket = new NotificationTicket(data.ticket);
        this.service = new NotificationService(data.service);
        this.product = new NotificationProduct(data.product);
        this.shortNote = this.note && this.note.length > 200 ? this.note.substring(0, 200) + '...' : null;
        if (!this.shortNote) this.showMoreNote = true;

    }
}