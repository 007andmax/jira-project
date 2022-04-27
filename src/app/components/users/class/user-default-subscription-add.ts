export class UserDefaultSubscriptionAdd {
    ticketSubscription: boolean;
    ticketManagerSubscription: boolean;
    invoiceSubscription: boolean;
    constructor(ticketSubscription, ticketManagerSubscription, invoiceSubscription) {
        this.ticketSubscription = ticketSubscription;
        this.ticketManagerSubscription = ticketManagerSubscription;
        this.invoiceSubscription = invoiceSubscription;
    }
}