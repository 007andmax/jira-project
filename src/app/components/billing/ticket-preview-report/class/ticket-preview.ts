import { TicketProfileProduct } from "src/app/components/tickets/tickets/class/ticket-profile-product";
import { TicketProfileService } from "src/app/components/tickets/tickets/class/ticket-profile-service";
import { TicketPreviewProduct } from "./ticket-preview-product";
import { TicketPreviewService } from "./ticket-preview-service";

export class TicketPreview {
    companyId: string;
    companyName: string;
    id: string;
    number: string;
    products: Array<TicketPreviewProduct> = [];
    services: Array<TicketPreviewService> = [];
    status: string;
    isUpdateAndClose: boolean = false;

    constructor(data: any) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.products = data.products.map(item => new TicketPreviewProduct(item));
            this.services = data.services.map(item => new TicketPreviewService(item));

        }
    }
}