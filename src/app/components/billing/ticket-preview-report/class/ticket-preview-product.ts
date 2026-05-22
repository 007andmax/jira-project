import { TicketProfileProduct } from "src/app/components/tickets/tickets/class/ticket-profile-product";

export class TicketPreviewProduct extends TicketProfileProduct {
    ticketUpdateId: string;
    manufacture: string;
    isEdit: boolean = false;

    public setIsEdit(data) {
        this.isEdit = data;
    }
}