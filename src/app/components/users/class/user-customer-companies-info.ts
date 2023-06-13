import { UserDefaultSubscription } from "./user-default-subscription";
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
    /**
* @description Set list  Default Subscriptions
* @param {Array<UserDefaultSubscription>} data - Array Objects Default Subscriptions 
*/
    public changeDefaultSubscriptions(data) {
        this.defaultSubscriptions = data;
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
