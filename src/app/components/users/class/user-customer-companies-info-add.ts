export class UserCustomerCompaniesInfoAdd {
    "companyId": string;
    "jobTitleDto": {
        id: string;
    }
    "customerUserRole": string;
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
        if (data.customerUserRole) this.customerUserRole = data.customerUserRole;
        this.defaultSubscriptions = data.defaultSubscriptions.getDataForUpdate();
        this.hasAccess = data.hasAccess;

    }
}
