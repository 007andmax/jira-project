export class ServiceReportsItem {
    ticketNumber: string;
    ticketSubject: string;
    ticketDate: number;
    status: string;
    ticketDevice: string;
    ticketCreatedBy: string;
    expenseName: string;
    expenseDate: number;
    description: string;
    serviceTime: number;
    serviceUser: string;
    constructor(data) {
        if (data) {
            this.ticketNumber = data.ticketNumber;
            this.ticketSubject = data.ticketSubject;
            this.ticketDate = data.ticketDate;
            this.status = data.status;
            this.ticketDevice = data.ticketDevice;
            this.ticketCreatedBy = data.ticketCreatedBy;
            this.expenseName = data.expenseName;
            this.expenseDate = data.expenseDate;
            this.description = data.description;
            this.serviceTime = data.serviceTime;
            this.serviceUser = data.serviceUser;
        }
    }
}