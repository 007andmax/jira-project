import { TicketProfileProduct } from "src/app/components/tickets/tickets/class/ticket-profile-product";
import { TicketProfileService } from "src/app/components/tickets/tickets/class/ticket-profile-service";

export class TicketPreview {
    companyId: string;
    companyName: string;
    id: string;
    number: string;
    products: Array<TicketProfileProduct> = [];
    services: Array<TicketProfileService> = [];
    status: string;
    constructor(data: any) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.products = data.products.map(item => new TicketProfileProduct(item));
            this.services = data.services.map(item => new TicketProfileService(item));
        }
    }
}