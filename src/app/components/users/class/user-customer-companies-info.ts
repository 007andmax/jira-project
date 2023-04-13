import { UserDefaultSubscription } from "./user-default-subscription";
import { UserJobTitle } from "./user-job-title";

export class UserCustomerCompaniesInfo {
    "companyId": string;
    "jobTitleDto": UserJobTitle;
    "customerUserRole": string;
    "defaultSubscriptions": UserDefaultSubscription;
    "hasAccess": boolean;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.jobTitleDto = (data.jobTitleDto && data.jobTitleDto.id) ? new UserJobTitle(data.jobTitleDto) : null;
            this.defaultSubscriptions = new UserDefaultSubscription(data.defaultSubscriptions);
        } else {
            this.jobTitleDto = null;
            this.defaultSubscriptions = new UserDefaultSubscription(null);
            this.hasAccess = false;
        }

    }
    public changeDefaultSubscriptions(data) {
        this.defaultSubscriptions = data;
    }
    public setJobTitleDto(data) {
        this.jobTitleDto = data;
    }
    public setUserRole(data) {
        this.customerUserRole = data;
    }
}
