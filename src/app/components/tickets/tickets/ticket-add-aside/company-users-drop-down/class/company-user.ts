import { User } from "src/app/components/users/class/user";
import { UserCustomerCompaniesInfo } from "src/app/components/users/class/user-customer-companies-info";

export class CompanyUser extends User {

    searchByCompany: UserCustomerCompaniesInfo;

    /**
* @description Set new vlaue "searchByCompany"
* @param {UserCustomerCompaniesInfo} data - Object of UserCustomerCompaniesInfo
*/
    public setSearchByCompany(data) {
        this.searchByCompany = data;
    }
}