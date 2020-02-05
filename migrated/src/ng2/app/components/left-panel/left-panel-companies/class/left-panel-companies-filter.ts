import { Tag } from 'src/ng2/app/interfaces/tag/tag';
import { Company } from 'src/ng2/app/interfaces/company/company';

export class LeftPanelCompaniesFilter {
    clientType: string;
    tehUser: string;
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
            if (this.clientType && this.clientType === item.clientType || this.tehUser && this.tehUser === item.techLeadId || this.clientIndustry && this.clientIndustry === ((item.clientIndustry) ? item.clientIndustry.name : '')) {
                return true;
            } else if (this.clientType && this.clientType !== item.clientType || this.tehUser && this.tehUser !== item.techLeadId || this.clientIndustry && this.clientIndustry !== ((item.clientIndustry) ? item.clientIndustry.name : '')) {
                return false;
            }
            return true;
        })
        return list;

    }
    public setTehUser(data) {
        this.tehUser = data;
    }
    public setClientIndustry(data) {
        this.clientIndustry = data;
    }

}