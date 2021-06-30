import { Company } from "src/app/interfaces/company/company";
import { CompanyIndustry } from "src/app/interfaces/company/company-industry";
import { CompanyItem } from "./company-item";

export class CompanyFilter {
    clientType: string;
    clientIndustry: CompanyIndustry;
    tags: Array<string> = [];
    tehUser: string;
    isArchived: boolean;
    constructor() {

    }
    getDataForFilter() {
        return {
            tagIds: (this.tags.length > 0) ? this.tags : undefined,
            clientType: (this.clientType) ? this.clientType : undefined,
            techLeadId: (this.tehUser) ? this.tehUser : undefined,
            clientIndustryId: (this.clientIndustry) ? this.clientIndustry.id : undefined,
            isArchived: (this.isArchived) ? true : undefined
        }
    }
    /*  public getFilterList(reqCompaniesList: Array<CompanyItem>) {
          let list = reqCompaniesList.filter(item => {
              //  if (item.companyInfo.contacts[0].tags) console.log("item.companyInfo.contacts[0].tags", item.companyInfo.contacts[0].tags);
              let tags = (item.companyInfo.contacts[0].tags) ? item.companyInfo.contacts[0].tags.find(tag => this.tags.find(idTag => idTag === tag.id)) : null;
  
              if (this.clientType && this.clientType === item.clientType || this.tehUser && this.tehUser === item.techLeadId || this.clientIndustry && this.clientIndustry.name === ((item.clientIndustry) ? item.clientIndustry.name : '') || (this.tags.length > 0) && tags !== null) {
                  return true;
              } else if (this.clientType && this.clientType !== item.clientType || this.tehUser && this.tehUser !== item.techLeadId || this.clientIndustry && this.clientIndustry.name !== ((item.clientIndustry) ? item.clientIndustry.name : '') || (this.tags.length > 0) && tags === null) {
                  return false;
              }
              return true;
          })
          return list;
  
      }*/
    public setArchived(data) {
        this.isArchived = data;
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
    public isExistFilters() {
        return this.clientType || this.clientIndustry || this.tehUser || this.tags.length > 0;
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