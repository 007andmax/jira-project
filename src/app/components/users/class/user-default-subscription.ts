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
            this.invoiceSubscription = new UserDefaultSubscriptionItem({ enabled: true, activated: true, });
            this.invoiceSubscription.setIsExist(false);
            this.ticketSubscription = new UserDefaultSubscriptionItem({ enabled: true, activated: true, });
            this.ticketSubscription.setIsExist(false);
            this.ticketManagerSubscription = new UserDefaultSubscriptionItem({ enabled: true, activated: true, });
            this.ticketManagerSubscription.setIsExist(false);
        }

    }
    /**
* @description Reset values object 'invoiceSubscription'
*/
    public clearEnabledAll() {
        this.invoiceSubscription.enabled = false;
        this.ticketSubscription.enabled = false;
        this.ticketManagerSubscription.enabled = false;
    }
    /**
* @description Return Object for Default Subscriptions  
* @returns  {Object} This is the result
*/
    public getDataForUpdate() {
        return {
            "invoiceSubscription": {
                "enabled": this.invoiceSubscription.enabled,
            },
            "ticketSubscription": {
                "enabled": this.ticketSubscription.enabled,
            },
            "ticketManagerSubscription": {
                "enabled": this.ticketManagerSubscription.enabled,
            }
        }
    }
}