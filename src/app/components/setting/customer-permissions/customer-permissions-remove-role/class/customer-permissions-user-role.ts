import { UserAvatar } from "src/app/components/users/class/user-avatar";
import { UserCustomerCompaniesInfo } from "src/app/components/users/class/user-customer-companies-info";

export class CustomerPermissionsRemoveRole {
    accountType: string;
    avatar: UserAvatar;
    customerCompanyInfo: Array<UserCustomerCompaniesInfo> = [];
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    constructor(data) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.customerCompanyInfo = data.customerCompanyInfo.map(item => new UserCustomerCompaniesInfo(item));
        }
    }
}