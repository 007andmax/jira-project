import { UserRole } from "src/app/components/users/class/user-role";
import { Company } from "src/app/interfaces/company/company";

export class CurrentUserCustomerCompaniesInfo {
    clientCompany: Company;
    "customerUserRole": UserRole;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.customerUserRole = (data.customerUserRole && data.customerUserRole.id) ? new UserRole(data.customerUserRole) : null;
        }
    }
}
