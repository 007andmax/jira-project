export class UserCustomerCompaniesInfoAdd {
    "companyId": string;
    "jobTitleDto": {
        id: string;
    }
    "customerUserRole": {
        "id": string;
    }
    "defaultSubscriptions": {
        "invoiceSubscription": {
            "enabled": false,
        },
        "ticketSubscription": {
            "enabled": true,
        },
        "ticketManagerSubscription": {
            "enabled": false
        }
    }
    "hasAccess": boolean;
    isPrimaryContact: boolean;
    constructor(data) {
        this.companyId = data.companyId;
        if (data.jobTitleDto) this.jobTitleDto = { id: data.jobTitleDto.id };
        if (data.customerUserRole) this.customerUserRole = { id: data.customerUserRole.id };
        this.defaultSubscriptions = this.getDefaultSubscriptionsForUpdate(data.defaultSubscriptions);
        this.hasAccess = data.hasAccess;
        this.isPrimaryContact = data.isPrimaryContact;
    }
    /**
 * @description Return Object for Default Subscriptions  
 * @returns  {Object} This is the result
*/
    public getDefaultSubscriptionsForUpdate(data) {
        return {
            "invoiceSubscription": {
                "enabled": data.invoiceSubscription.enabled,
                "activated": data.invoiceSubscription.activated,
            },
            "ticketSubscription": {
                "enabled": data.ticketSubscription.enabled,
                "activated": data.ticketSubscription.activated,
            },
            "ticketManagerSubscription": {
                "enabled": data.ticketManagerSubscription.enabled,
                "activated": data.ticketManagerSubscription.activated,
            }
        }
    }
}
