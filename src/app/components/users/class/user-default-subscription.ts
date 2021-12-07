import { UserDefaultSubscriptionItem } from "./user-default-subscription-item";

export class UserDefaultSubscription {
    invoiceSubscription: UserDefaultSubscriptionItem;
    ticketSubscription: UserDefaultSubscriptionItem;
    ticketManagerSubscription: UserDefaultSubscriptionItem;
    constructor(data = null) {
        if (data) {
            this.invoiceSubscription = new UserDefaultSubscriptionItem(data.invoiceSubscription);
            this.ticketSubscription = new UserDefaultSubscriptionItem(data.ticketSubscription);
            this.ticketManagerSubscription = new UserDefaultSubscriptionItem(data.ticketManagerSubscription);
        } else {
            this.invoiceSubscription = new UserDefaultSubscriptionItem({ enabled: false, activated: true, });
            this.invoiceSubscription.setSsExist(false);
            this.ticketSubscription = new UserDefaultSubscriptionItem({ enabled: true, activated: true, });
            this.ticketSubscription.setSsExist(false);
            this.ticketManagerSubscription = new UserDefaultSubscriptionItem({ enabled: false, activated: true, });
            this.ticketManagerSubscription.setSsExist(false);
        }

    }
}