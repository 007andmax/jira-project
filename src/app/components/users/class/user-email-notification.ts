export class UserEmailNotifications {
    clientCompanyUpdated: boolean;
    id: string;
    myTicketUpdated: boolean;
    newDevice: boolean;
    scheduleChanged: boolean;
    ticketCloseNotifications: boolean;
    ticketCreated: boolean;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
}