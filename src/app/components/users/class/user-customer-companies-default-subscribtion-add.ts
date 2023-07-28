export class UserCustomerCompaniesDefaultSubscribtionAdd {
    "ticketSubscription": boolean;
    "ticketManagerSubscription": boolean;
    "invoiceSubscription": boolean;
    "userId": string;
    "customerCompanyId": string;
    constructor(ticketSubscription, ticketManagerSubscription, invoiceSubscription, userId, customerCompanyId) {
        this.ticketSubscription = ticketSubscription;
        this.ticketManagerSubscription = ticketManagerSubscription;
        this.invoiceSubscription = invoiceSubscription;
        this.userId = userId;
        this.customerCompanyId = customerCompanyId;
    }
}