import { CompanyIndustry } from "src/app/interfaces/company/company-industry";
import { CompanyFilterTop } from "./company-filter-top";

export class CompanyFilter {
    clientType: string;
    clientIndustry: CompanyIndustry;
    tags: Array<string> = [];
    tehUser: string;
    isArchived: boolean;
    devices = [];
    users = [];
    showArchivedCompanies: boolean = false;
    filter: Array<CompanyFilterTop> = [
        new CompanyFilterTop('name', 'ASC'),
        new CompanyFilterTop('address', ''),
        new CompanyFilterTop('primary_contact', ''),
        new CompanyFilterTop('email', ''),
        new CompanyFilterTop('tickets', ''),
        new CompanyFilterTop('devices', ''),
        new CompanyFilterTop('users', '')];
    constructor() {

    }
    public setDevices(data) {
        this.devices = data;
    }
    public setUsers(data) {
        this.users = data;
    }
    public setShowArchivedCompanies(data) {
        this.showArchivedCompanies = data;
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
    public setArchived(data) {
        this.isArchived = data;
    }
    public setTehUser(data) {
        this.tehUser = data;
    }
    public setFilters(data) {
        if (data.clientType !== "ARCHIVE") this.clientType = data.clientType;
        if (data.clientType === "ARCHIVE") this.clientType = null;
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
    onFilter(field, list) {
        let index = this.filter.findIndex(item => item.field === field);
        if (index > -1) {
            let sort = this.filter[index].filter;
            if (field === 'name') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterName(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            if (field === 'address') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterAdress(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            if (field === 'primary_contact') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterPrimaryContact(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            if (field === 'email') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterPrimaryEmail(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            if (field === 'tickets') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterTickets(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            if (field === 'devices') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterDevices(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            if (field === 'users') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterUsers(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
        }
    }
    private clearFilter() {
        this.filter.forEach(item => item.filter = '');
    }
    private onFilterUsers(list) {
        list.sort((a, b) => (this.getCountusers(a) > this.getCountusers(b)) ?
            1 : ((this.getCountusers(b) > this.getCountusers(a)) ? -1 : 0));
    }
    private onFilterDevices(list) {
        list.sort((a, b) => (((this.devices[a.id]) ? this.devices[a.id].length : 0) > ((this.devices[b.id]) ? this.devices[b.id].length : 0)) ?
            1 : ((((this.devices[b.id]) ? this.devices[b.id].length : 0) > ((this.devices[a.id]) ? this.devices[a.id].length : 0)) ? -1 : 0));
    }
    private onFilterName(list) {
        list.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
            1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    }

    private onFilterAdress(list) {
        list.sort((a, b) => (this.getPrimaryAddress(a) > this.getPrimaryAddress(b)) ?
            1 : ((this.getPrimaryAddress(b) > this.getPrimaryAddress(a)) ? -1 : 0));
    }
    private onFilterPrimaryContact(list) {
        list.sort((a, b) => (this.getPrimaryPhone(a).toLowerCase() > this.getPrimaryPhone(b).toLowerCase()) ?
            1 : ((this.getPrimaryPhone(b).toLowerCase() > this.getPrimaryPhone(a).toLowerCase()) ? -1 : 0));
    }
    private onFilterPrimaryEmail(list) {
        list.sort((a, b) => (this.getEmail(a).toLowerCase() > this.getEmail(b).toLowerCase()) ?
            1 : ((this.getEmail(b).toLowerCase() > this.getEmail(a).toLowerCase()) ? -1 : 0));
    }
    private onFilterTickets(list) {
        list.sort((a, b) => ((a.companyStatistic.ticketsSubmitted || 0) > (b.companyStatistic.ticketsSubmitted || 0)) ?
            1 : (((b.companyStatistic.ticketsSubmitted || 0) > (a.companyStatistic.ticketsSubmitted || 0)) ? -1 : 0));
    }
    private getCountusers(company) {
        return this.users.filter((user) => {
            var isArchived = user.deletedAt || company.deletedAt;
            return !isArchived && !this.showArchivedCompanies && user.company.id === company.id || this.showArchivedCompanies && isArchived && user.company.id === company.id;
        }).length;
    }
    private getPrimaryAddress(company) {
        let primaryAddress;
        if (company.companyInfo) {
            if (company.companyInfo.addresses) {
                for (let address of company.companyInfo.addresses) {
                    if (address.isPrimary) primaryAddress = address;
                }
            }
        }
        if (primaryAddress) {
            return primaryAddress.addressWithSuitNumberAndPostalCode.toLowerCase();
        } else {
            return '';
        }
    }
    private getPrimaryPhone(company) {
        let primaryContact;
        if (company.companyInfo) {
            if (company.companyInfo.contacts) {
                for (let contact of company.companyInfo.contacts) {
                    if (!primaryContact || contact.priority > primaryContact.priority) primaryContact = contact;
                }
            }
        }
        return `${primaryContact.firstName} ${primaryContact.lastName}`;
    }
    private getEmail(company) {
        let primaryContact;
        if (company.companyInfo) {
            if (company.companyInfo.contacts) {
                for (let contact of company.companyInfo.contacts) {
                    if (!primaryContact || contact.priority > primaryContact.priority) primaryContact = contact;
                }
            }
        }
        return primaryContact.primaryEmail;
    }
}