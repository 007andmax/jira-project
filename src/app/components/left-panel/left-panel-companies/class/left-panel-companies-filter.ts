import { Tag } from 'src/app/interfaces/tag/tag';
import { Company } from 'src/app/interfaces/company/company';

export class LeftPanelCompaniesFilter {
    clientType: string;
    techUser: string;
    clientIndustry: string;
    constructor() {

    }
    public setClientType(data) {
        this.clientType = data;
    }
    public getClientType() {
        return this.clientType;
    }
    public getFilterList(reqCompaniesList: Array<Company>) {
        let list = reqCompaniesList.filter(item => {
            if (this.clientType && this.clientType === item.clientType || this.techUser && this.techUser === item.techLeadId || this.clientIndustry && this.clientIndustry === ((item.clientIndustry) ? item.clientIndustry.name : '')) {
                return true;
            } else if (this.clientType && this.clientType !== item.clientType || this.techUser && this.techUser !== item.techLeadId || this.clientIndustry && this.clientIndustry !== ((item.clientIndustry) ? item.clientIndustry.name : '')) {
                return false;
            }
            return true;
        })
        return list;

    }
    public setTechUser(data) {
        this.techUser = data;
    }
    public setClientIndustry(data) {
        this.clientIndustry = data;
    }

}