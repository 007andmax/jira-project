import { TicketProfileService } from "src/app/components/tickets/tickets/class/ticket-profile-service";

export class TicketPreviewService extends TicketProfileService {
    ticketUpdateId: string;
    isEdit: boolean = false;
    public setIsEdit(data) {
        this.isEdit = data;
    }
}