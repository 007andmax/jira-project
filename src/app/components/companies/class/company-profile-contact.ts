import { UserDefaultSubscriptionAdd } from "../../users/class/user-default-subscription-add";

export class CompanyProfileContact {
    firstName: string;
    phoneNumbers: any;
    lastName: string;
    primaryEmail: string;

    jobTitleId: string;
    avatar: string;
    defaultSubscriptions: UserDefaultSubscriptionAdd;
    id: string;
    constructor() {
        this.firstName = null;
        this.phoneNumbers = [{
            number: '',
            typeNumber: 'OFFICE'
        }];
        this.lastName = null;
        this.primaryEmail = null;
        this.defaultSubscriptions = new UserDefaultSubscriptionAdd(true, false, true);
    }
    public fullVersion() {
        this.jobTitleId = null;
    }

}