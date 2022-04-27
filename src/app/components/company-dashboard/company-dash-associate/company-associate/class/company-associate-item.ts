import { CompanyProfile } from "src/app/components/companies/class/company-profile";

export class CompanyAssociateItem extends CompanyProfile {

    isHover: boolean = false;
    constructor(data = null) {
        super();
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
}