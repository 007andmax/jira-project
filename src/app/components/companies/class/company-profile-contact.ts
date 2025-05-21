import { UserCustomerCompaniesInfo } from "../../users/class/user-customer-companies-info";

export class CompanyProfileContact {
    firstName: string;
    phoneNumbers: any;
    lastName: string;
    primaryEmail: string;
    customerCompaniesInfo: Array<UserCustomerCompaniesInfo> = [];
    jobTitleId: string;
    avatar: string;
    id: string;
    companyId: string;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.customerCompaniesInfo = data.customerCompaniesInfo.map(item => new UserCustomerCompaniesInfo(item));
        } else {
            this.firstName = null;
            this.phoneNumbers = [{
                number: '',
                typeNumber: 'OFFICE'
            }];
            this.lastName = null;
            this.primaryEmail = null;
            this.customerCompaniesInfo = [new UserCustomerCompaniesInfo()]
        }
    }
    public setId(data) {
        this.id = data;
    }
    public fullVersion() {
        this.jobTitleId = null;
    }
    public getDataForRequest(isAdd, isUseSelectedUser) {
        let phoneNumbers = (this.phoneNumbers.length == 0 || !this.phoneNumbers[0].number || this.phoneNumbers[0].number.length === 0) ? [] : this.phoneNumbers;
        if (isAdd && isUseSelectedUser) return {
            id: this.id
        }
        return {
            firstName: this.firstName,
            phoneNumbers: phoneNumbers,
            lastName: this.lastName,
            primaryEmail: this.primaryEmail,
            customerCompaniesInfo: this.customerCompaniesInfo.map(item => ((isAdd) ? item.getDataForAddRequest() : item.getDataForUpdateRequest())),
            jobTitleId: this.jobTitleId,
            avatar: this.avatar,
            id: this.id,
            companyId: this.companyId
        }
    }

}