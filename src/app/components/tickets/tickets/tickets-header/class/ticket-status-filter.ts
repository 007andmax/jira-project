import { TicketStatus } from "src/app/components/setting/ticket-settings-page/tickets-status/class/ticket-status";
import { ItemStatus } from "../../../class/item-status";

export class TicketStatusFilter extends TicketStatus {

    title: string;
    constructor(data) {
        super(data);
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }

        }
        let title = [new ItemStatus('Unassigned', 'unassigned', 'UNASSIGNED'),
        new ItemStatus('Completed', 'completed', 'COMPLETED'),
        new ItemStatus('In Progress', 'inProgress', 'IN_PROGRESS'),
        new ItemStatus('On Hold', 'onHold', 'ON_HOLD'),
        new ItemStatus('Pending Review', 'PENDING REVIEW', 'PENDING REVIEW')].find(item => item.status === this.name)
        if (title) {
            this.title = title.title;
        } else {
            this.title = this.name;
        }

    }
}