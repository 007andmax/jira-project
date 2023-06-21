import { UserCustomerCompaniesInfoAdd } from "./user-customer-companies-info-add";

export class UserCustomerCompaniesInfoUpdate extends UserCustomerCompaniesInfoAdd {

    constructor(data, isCustomerPortal) {
        super(data);
        this.companyId = data.companyId;
        if (data.jobTitleDto) this.jobTitleDto = { id: data.jobTitleDto.id };
        if (data.customerUserRole) this.customerUserRole = { id: data.customerUserRole.id };
        this.defaultSubscriptions = this.getDefaultSubscriptionsForUpdate(data.defaultSubscriptions);
        this.hasAccess = data.hasAccess;
        if (isCustomerPortal) this.isPrimaryContact = data.isPrimaryContact;
        if (!isCustomerPortal) this.isPrimaryContact = undefined;
    }
}