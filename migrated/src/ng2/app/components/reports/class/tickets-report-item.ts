import { TicketsReportItemUpdate } from './tickets-report-item-update';

export class TicketsReportItem {
    ticketNumber: string;
    ticketCreatedAt: string;
    status: string;
    clientUserId: string;
    techUserId: string;
    deviceName: string;
    responseTime: number;
    description: string;
    customerReportId: string;
    updates: Array<TicketsReportItemUpdate>;
    constructor(data) {
        if (data) {
            this.ticketNumber = data.ticketNumber;
            this.ticketCreatedAt = data.ticketCreatedAt;
            this.status = data.status;
            this.clientUserId = data.clientUserId;
            this.techUserId = data.techUserId;
            this.deviceName = data.deviceName;
            this.responseTime = data.responseTime;
            this.description = data.description;
            this.customerReportId = data.customerReportId;
            this.updates = (data.updates) ? data.updates.map(element => {
                return new TicketsReportItemUpdate(element);
            }) : [];
        }
    }
}