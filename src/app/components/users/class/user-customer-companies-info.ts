import { UserDefaultSubscription } from "./user-default-subscription";
import { UserDefaultSubscriptionItem } from "./user-default-subscription-item";
import { UserJobTitle } from "./user-job-title";
import { UserRole } from "./user-role";

export class UserCustomerCompaniesInfo {
    clientCompanyName: string;
    "companyId": string;
    "jobTitleDto": UserJobTitle;
    "customerUserRole": UserRole;
    "defaultSubscriptions": UserDefaultSubscription;
    "hasAccess": boolean;
    "isPrimaryContact": boolean = false;
    isArchived: boolean = false;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.jobTitleDto = (data.jobTitleDto && data.jobTitleDto.id) ? new UserJobTitle(data.jobTitleDto) : null;
            this.defaultSubscriptions = new UserDefaultSubscription(data.defaultSubscriptions);
            this.customerUserRole = (data.customerUserRole && data.customerUserRole.id) ? new UserRole(data.customerUserRole) : null;
        } else {
            this.jobTitleDto = null;
            this.customerUserRole = null;
            this.defaultSubscriptions = new UserDefaultSubscription(null);
            this.hasAccess = false;
        }

    }
    public setDefaultSubscriptionsForAddUser() {
        this.defaultSubscriptions.invoiceSubscription = new UserDefaultSubscriptionItem({ enabled: false, activated: true, });
        this.defaultSubscriptions.ticketSubscription = new UserDefaultSubscriptionItem({ enabled: true, activated: true, });
        this.defaultSubscriptions.ticketManagerSubscription = new UserDefaultSubscriptionItem({ enabled: false, activated: true, });
        this.defaultSubscriptions.invoiceSubscription.setIsExist(true);
        this.defaultSubscriptions.ticketSubscription.setIsExist(true);
        this.defaultSubscriptions.ticketManagerSubscription.setIsExist(true);
    }
    /**
* @description Return Object for request add Copmany
* @returns  {Object} This is the result
*/
    public getDataForAddRequest() {
        return {
            defaultSubscriptions: this.defaultSubscriptions.getDataForUpdate(),
            isPrimaryContact: this.isPrimaryContact
        }
    }
    /**
* @description Return Object for request Update Copmany
* @returns  {Object} This is the result
*/
    public getDataForUpdateRequest() {
        return {
            clientCompanyName: this.clientCompanyName,
            "companyId": this.companyId,
            "jobTitleDto": this.jobTitleDto,
            "customerUserRole": this.customerUserRole,
            defaultSubscriptions: this.defaultSubscriptions.getDataForUpdate(),
            "hasAccess": this.hasAccess,
            "isPrimaryContact": this.isPrimaryContact
        }
    }
    /**
* @description Set object Default Subscriptions
* @param {UserDefaultSubscription} data - Object Default Subscriptions 
*/
    public changeDefaultSubscriptions(data) {
        this.defaultSubscriptions = new UserDefaultSubscription(data);
    }
    /**
* @description Set Job Title Dto
* @param {UserJobTitle} data - Object Job Title Dto
*/
    public setJobTitleDto(data) {
        this.jobTitleDto = data;
    }
    /**
* @description Set Customer User Role
* @param {UserRole} data - Object Customer User Role
*/
    public setUserRole(data) {
        this.customerUserRole = data;
    }
}
