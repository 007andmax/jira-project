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
            "activated": false
        },
        "ticketSubscription": {
            "enabled": true,
            "activated": true
        },
        "ticketManagerSubscription": {
            "enabled": false,
            "activated": false
        }
    }
    "hasAccess": boolean;
    constructor(data) {
        this.companyId = data.companyId;
        if (data.jobTitleDto) this.jobTitleDto = { id: data.jobTitleDto.id };
        if (data.customerUserRole) this.customerUserRole = { id: data.customerUserRole.id };
        this.defaultSubscriptions = data.defaultSubscriptions.getDataForUpdate();
        this.hasAccess = data.hasAccess;

    }
}
