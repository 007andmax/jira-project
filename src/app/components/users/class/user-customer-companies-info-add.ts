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
    constructor(data) {
        console.log("data", data);
        this.companyId = data.companyId;
        if (data.jobTitleDto) this.jobTitleDto = { id: data.jobTitleDto.id };
        if (data.customerUserRole) this.customerUserRole = { id: data.customerUserRole.id };
        this.defaultSubscriptions = this.getDefaultSubscriptionsForUpdate(data.defaultSubscriptions);
        this.hasAccess = data.hasAccess;
    }
    public getDefaultSubscriptionsForUpdate(data) {
        return {
            "invoiceSubscription": {
                "enabled": data.invoiceSubscription.enabled,
            },
            "ticketSubscription": {
                "enabled": data.ticketSubscription.enabled,
            },
            "ticketManagerSubscription": {
                "enabled": data.ticketManagerSubscription.enabled,
            }
        }
    }
}
