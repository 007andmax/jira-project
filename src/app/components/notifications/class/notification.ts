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
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
        this.ticket = new NotificationTicket(data.ticket);
        this.service = new NotificationService(data.service);
        this.product = new NotificationProduct(data.product);
    }
}