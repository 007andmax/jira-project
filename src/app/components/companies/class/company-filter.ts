import { Company } from "src/app/interfaces/company/company";
import { CompanyItem } from "./company-item";

export class CompanyFilter {
    clientType: string;
    clientIndustry: string;
    tags: Array<string> = [];
    tehUser: string;
    constructor() {

    }
    public getFilterList(reqCompaniesList: Array<CompanyItem>) {
        let list = reqCompaniesList.filter(item => {
            if (item.companyInfo.contacts[0].tags) console.log("item.companyInfo.contacts[0].tags", item.companyInfo.contacts[0].tags);
            let tags = (item.companyInfo.contacts[0].tags) ? item.companyInfo.contacts[0].tags.find(tag => this.tags.find(idTag => idTag === tag.id)) : null;

            if (this.clientType && this.clientType === item.clientType || this.tehUser && this.tehUser === item.techLeadId || this.clientIndustry && this.clientIndustry === ((item.clientIndustry) ? item.clientIndustry.name : '') || (this.tags.length > 0) && tags !== null) {
                return true;
            } else if (this.clientType && this.clientType !== item.clientType || this.tehUser && this.tehUser !== item.techLeadId || this.clientIndustry && this.clientIndustry !== ((item.clientIndustry) ? item.clientIndustry.name : '') || (this.tags.length > 0) && tags === null) {
                return false;
            }
            return true;
        })
        return list;

    }
    public setTehUser(data) {
        this.tehUser = data;
    }
    public setFilters(data) {
        this.clientType = data.clientType;
        this.clientIndustry = data.clientIndustry;
        this.tehUser = data.tehUser;
        this.tags = data.tags;
    }
    public setClientIndustry(data) {
        this.clientIndustry = data;
    }
    public setTags(data) {
        this.tags = data;
    }
    public setClientType(data) {
        this.clientType = data;
    }
}