export class TechServiceItem {
    companyName: string;
    quantity: number;
    serviceExpenseDate: number;
    serviceName: string;
    ticketNumber: string;
    user: string;
    constructor(data) {
        this.companyName = data.companyName;
        this.quantity = data.quantity;
        this.serviceExpenseDate = data.serviceExpenseDate;
        this.serviceName = data.serviceName;
        this.ticketNumber = data.ticketNumber;
        this.user = data.user;
    }
}