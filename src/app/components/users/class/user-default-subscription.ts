import { UserDefaultSubscriptionItem } from "./user-default-subscription-item";

export class UserDefaultSubscription {
    invoiceSubscription: UserDefaultSubscriptionItem;
    ticketSubscription: UserDefaultSubscriptionItem;
    ticketManagerSubscription: UserDefaultSubscriptionItem;
    constructor(data = null) {
        if (data) {
            this.invoiceSubscription = new UserDefaultSubscriptionItem(data.invoice);
            this.ticketSubscription = new UserDefaultSubscriptionItem(data.ticket);
            this.ticketManagerSubscription = new UserDefaultSubscriptionItem(data.ticketManager);
        } else {
            this.invoiceSubscription = new UserDefaultSubscriptionItem({ enabled: true, activated: true });
            this.ticketSubscription = new UserDefaultSubscriptionItem({ enabled: true, activated: true });
            this.ticketManagerSubscription = new UserDefaultSubscriptionItem({ enabled: true, activated: true });
        }

    }
}