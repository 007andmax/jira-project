import { User } from "src/app/components/users/class/user";
import { UserCustomerCompaniesInfo } from "src/app/components/users/class/user-customer-companies-info";

export class Companyiser extends User {

    searchByCompany: UserCustomerCompaniesInfo;

    public setSearchByCompany(data) {
        this.searchByCompany = data;
    }
}