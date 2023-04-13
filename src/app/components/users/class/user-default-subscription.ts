import { UserDefaultSubscriptionItem } from "./user-default-subscription-item";

export class UserDefaultSubscription {
    id: string;
    invoiceSubscription: UserDefaultSubscriptionItem;
    ticketSubscription: UserDefaultSubscriptionItem;
    ticketManagerSubscription: UserDefaultSubscriptionItem;
    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.invoiceSubscription = new UserDefaultSubscriptionItem(data.invoiceSubscription);
            this.ticketSubscription = new UserDefaultSubscriptionItem(data.ticketSubscription);
            this.ticketManagerSubscription = new UserDefaultSubscriptionItem(data.ticketManagerSubscription);
        } else {
            this.invoiceSubscription = new UserDefaultSubscriptionItem({ enabled: false, activated: true, });
            this.invoiceSubscription.setIsExist(false);
            this.ticketSubscription = new UserDefaultSubscriptionItem({ enabled: true, activated: true, });
            this.ticketSubscription.setIsExist(false);
            this.ticketManagerSubscription = new UserDefaultSubscriptionItem({ enabled: false, activated: true, });
            this.ticketManagerSubscription.setIsExist(false);
        }

    }
    public clearEnabledAll() {
        this.invoiceSubscription.enabled = false;
        this.ticketSubscription.enabled = false;
        this.ticketManagerSubscription.enabled = false;
    }
    public getDataForUpdate() {
        return {
            "invoiceSubscription": {
                "enabled": this.invoiceSubscription.enabled,
                "activated": this.invoiceSubscription.activated
            },
            "ticketSubscription": {
                "enabled": this.ticketSubscription.enabled,
                "activated": this.ticketSubscription.activated
            },
            "ticketManagerSubscription": {
                "enabled": this.ticketManagerSubscription.enabled,
                "activated": this.ticketManagerSubscription.activated
            }
        }
    }
}